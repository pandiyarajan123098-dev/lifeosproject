const { executeQuery, sql, getPool } = require('../config/db');

/**
 * Get profile, interests, and skills for authenticated user
 * GET /api/profile
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch profile
    const profileRes = await executeQuery(
      `SELECT p.id, p.user_id, p.first_name, p.last_name, p.age, p.occupation,
              p.skill_level, p.primary_goal, p.secondary_goal, p.daily_available_minutes,
              p.learning_style, CONVERT(VARCHAR(10), p.target_date, 23) AS target_date,
              p.preferred_task_count, p.onboarding_completed,
              u.full_name, u.email
       FROM dbo.LifeOSProfiles p
       JOIN dbo.LifeOSUsers u ON p.user_id = u.id
       WHERE p.user_id = @userId`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    let profile = profileRes.recordset[0] || null;

    // Fetch interests
    const interestsRes = await executeQuery(
      'SELECT id, interest_name FROM dbo.LifeOSInterests WHERE user_id = @userId ORDER BY id ASC',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    // Fetch skills
    const skillsRes = await executeQuery(
      'SELECT id, skill_name, proficiency_level FROM dbo.LifeOSSkills WHERE user_id = @userId ORDER BY id ASC',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    return res.status(200).json({
      success: true,
      profile: profile,
      interests: interestsRes.recordset.map((r) => r.interest_name),
      skills: skillsRes.recordset.map((r) => ({
        name: r.skill_name,
        level: r.proficiency_level,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Save complete onboarding form (Personal Info, Goals, Time, Interests, Skills)
 * POST /api/profile
 */
async function saveOnboarding(req, res, next) {
  const p = await getPool();
  if (!p) {
    return res.status(500).json({ success: false, message: 'Database connection unavailable.' });
  }

  const transaction = new sql.Transaction(p);

  try {
    const userId = req.user.id;
    const {
      first_name,
      last_name,
      age,
      occupation,
      skill_level,
      primary_goal,
      secondary_goal,
      daily_available_minutes,
      learning_style,
      target_date,
      preferred_task_count,
      interests = [],
      skills = [],
    } = req.body;

    await transaction.begin();

    // 1. Update or Insert Profile
    const updateProfileReq = new sql.Request(transaction);
    updateProfileReq.input('userId', sql.Int, userId);
    updateProfileReq.input('firstName', sql.NVarChar(100), first_name || null);
    updateProfileReq.input('lastName', sql.NVarChar(100), last_name || null);
    updateProfileReq.input('age', sql.Int, age ? parseInt(age, 10) : null);
    updateProfileReq.input('occupation', sql.NVarChar(255), occupation || null);
    updateProfileReq.input('skillLevel', sql.NVarChar(50), skill_level || 'Beginner');
    updateProfileReq.input('primaryGoal', sql.NVarChar(500), primary_goal || null);
    updateProfileReq.input('secondaryGoal', sql.NVarChar(500), secondary_goal || null);
    updateProfileReq.input('dailyMinutes', sql.Int, daily_available_minutes ? parseInt(daily_available_minutes, 10) : 60);
    updateProfileReq.input('learningStyle', sql.NVarChar(50), learning_style || 'Mixed');
    updateProfileReq.input('targetDate', sql.Date, target_date || null);
    updateProfileReq.input('preferredCount', sql.Int, preferred_task_count ? parseInt(preferred_task_count, 10) : 4);

    await updateProfileReq.query(`
      IF EXISTS (SELECT 1 FROM dbo.LifeOSProfiles WHERE user_id = @userId)
      BEGIN
        UPDATE dbo.LifeOSProfiles
        SET first_name = @firstName,
            last_name = @lastName,
            age = @age,
            occupation = @occupation,
            skill_level = @skillLevel,
            primary_goal = @primaryGoal,
            secondary_goal = @secondaryGoal,
            daily_available_minutes = @dailyMinutes,
            learning_style = @learningStyle,
            target_date = @targetDate,
            preferred_task_count = @preferredCount,
            onboarding_completed = 1,
            updated_at = SYSUTCDATETIME()
        WHERE user_id = @userId;
      END
      ELSE
      BEGIN
        INSERT INTO dbo.LifeOSProfiles (
          user_id, first_name, last_name, age, occupation,
          skill_level, primary_goal, secondary_goal, daily_available_minutes,
          learning_style, target_date, preferred_task_count,
          onboarding_completed, created_at, updated_at
        ) VALUES (
          @userId, @firstName, @lastName, @age, @occupation,
          @skillLevel, @primaryGoal, @secondaryGoal, @dailyMinutes,
          @learningStyle, @targetDate, @preferredCount,
          1, SYSUTCDATETIME(), SYSUTCDATETIME()
        );
      END
    `);

    // 2. Save Interests (delete existing and insert new)
    const delInterestsReq = new sql.Request(transaction);
    delInterestsReq.input('userId', sql.Int, userId);
    await delInterestsReq.query('DELETE FROM dbo.LifeOSInterests WHERE user_id = @userId');

    for (const item of interests) {
      const name = typeof item === 'string' ? item.trim() : item.interest_name?.trim();
      if (name) {
        const insIntReq = new sql.Request(transaction);
        insIntReq.input('userId', sql.Int, userId);
        insIntReq.input('name', sql.NVarChar(100), name);
        await insIntReq.query('INSERT INTO dbo.LifeOSInterests (user_id, interest_name) VALUES (@userId, @name)');
      }
    }

    // 3. Save Skills (delete existing and insert new)
    const delSkillsReq = new sql.Request(transaction);
    delSkillsReq.input('userId', sql.Int, userId);
    await delSkillsReq.query('DELETE FROM dbo.LifeOSSkills WHERE user_id = @userId');

    for (const item of skills) {
      const skillName = typeof item === 'string' ? item.trim() : (item.name || item.skill_name)?.trim();
      const profLevel = typeof item === 'object' && item.level ? item.level : 'Beginner';
      if (skillName) {
        const insSkillReq = new sql.Request(transaction);
        insSkillReq.input('userId', sql.Int, userId);
        insSkillReq.input('name', sql.NVarChar(100), skillName);
        insSkillReq.input('level', sql.NVarChar(50), profLevel);
        await insSkillReq.query('INSERT INTO dbo.LifeOSSkills (user_id, skill_name, proficiency_level) VALUES (@userId, @name, @level)');
      }
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed and profile saved successfully!',
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rbErr) {
        console.error('Transaction rollback error:', rbErr);
      }
    }
    next(error);
  }
}

/**
 * Update Profile Settings
 * PUT /api/profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      first_name,
      last_name,
      age,
      occupation,
      skill_level,
      primary_goal,
      secondary_goal,
      daily_available_minutes,
      learning_style,
      target_date,
      preferred_task_count,
    } = req.body;

    await executeQuery(
      `UPDATE dbo.LifeOSProfiles
       SET first_name = @firstName,
           last_name = @lastName,
           age = @age,
           occupation = @occupation,
           skill_level = @skillLevel,
           primary_goal = @primaryGoal,
           secondary_goal = @secondaryGoal,
           daily_available_minutes = @dailyMinutes,
           learning_style = @learningStyle,
           target_date = @targetDate,
           preferred_task_count = @preferredCount,
           updated_at = SYSUTCDATETIME()
       WHERE user_id = @userId`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'firstName', type: sql.NVarChar(100), value: first_name || null },
        { name: 'lastName', type: sql.NVarChar(100), value: last_name || null },
        { name: 'age', type: sql.Int, value: age ? parseInt(age, 10) : null },
        { name: 'occupation', type: sql.NVarChar(255), value: occupation || null },
        { name: 'skillLevel', type: sql.NVarChar(50), value: skill_level || 'Beginner' },
        { name: 'primaryGoal', type: sql.NVarChar(500), value: primary_goal || null },
        { name: 'secondaryGoal', type: sql.NVarChar(500), value: secondary_goal || null },
        { name: 'dailyMinutes', type: sql.Int, value: daily_available_minutes ? parseInt(daily_available_minutes, 10) : 60 },
        { name: 'learningStyle', type: sql.NVarChar(50), value: learning_style || 'Mixed' },
        { name: 'targetDate', type: sql.Date, value: target_date || null },
        { name: 'preferredCount', type: sql.Int, value: preferred_task_count ? parseInt(preferred_task_count, 10) : 4 },
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user interests
 * GET /api/profile/interests
 */
async function getInterests(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await executeQuery(
      'SELECT id, interest_name FROM dbo.LifeOSInterests WHERE user_id = @userId ORDER BY id ASC',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    return res.status(200).json({
      success: true,
      interests: result.recordset.map((r) => r.interest_name),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user interests
 * PUT /api/profile/interests
 */
async function updateInterests(req, res, next) {
  const p = await getPool();
  if (!p) {
    return res.status(500).json({ success: false, message: 'Database connection unavailable.' });
  }

  const transaction = new sql.Transaction(p);
  try {
    const userId = req.user.id;
    const { interests = [] } = req.body;

    await transaction.begin();

    const delReq = new sql.Request(transaction);
    delReq.input('userId', sql.Int, userId);
    await delReq.query('DELETE FROM dbo.LifeOSInterests WHERE user_id = @userId');

    for (const item of interests) {
      const name = typeof item === 'string' ? item.trim() : item.interest_name?.trim();
      if (name) {
        const insReq = new sql.Request(transaction);
        insReq.input('userId', sql.Int, userId);
        insReq.input('name', sql.NVarChar(100), name);
        await insReq.query('INSERT INTO dbo.LifeOSInterests (user_id, interest_name) VALUES (@userId, @name)');
      }
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: 'Interests updated successfully.',
      interests,
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (e) {}
    }
    next(error);
  }
}

/**
 * Get user skills
 * GET /api/profile/skills
 */
async function getSkills(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await executeQuery(
      'SELECT id, skill_name, proficiency_level FROM dbo.LifeOSSkills WHERE user_id = @userId ORDER BY id ASC',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    return res.status(200).json({
      success: true,
      skills: result.recordset.map((r) => ({
        name: r.skill_name,
        level: r.proficiency_level,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user skills
 * PUT /api/profile/skills
 */
async function updateSkills(req, res, next) {
  const p = await getPool();
  if (!p) {
    return res.status(500).json({ success: false, message: 'Database connection unavailable.' });
  }

  const transaction = new sql.Transaction(p);
  try {
    const userId = req.user.id;
    const { skills = [] } = req.body;

    await transaction.begin();

    const delReq = new sql.Request(transaction);
    delReq.input('userId', sql.Int, userId);
    await delReq.query('DELETE FROM dbo.LifeOSSkills WHERE user_id = @userId');

    for (const item of skills) {
      const skillName = typeof item === 'string' ? item.trim() : (item.name || item.skill_name)?.trim();
      const profLevel = typeof item === 'object' && item.level ? item.level : 'Beginner';
      if (skillName) {
        const insReq = new sql.Request(transaction);
        insReq.input('userId', sql.Int, userId);
        insReq.input('name', sql.NVarChar(100), skillName);
        insReq.input('level', sql.NVarChar(50), profLevel);
        await insReq.query('INSERT INTO dbo.LifeOSSkills (user_id, skill_name, proficiency_level) VALUES (@userId, @name, @level)');
      }
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: 'Skills updated successfully.',
      skills,
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (e) {}
    }
    next(error);
  }
}

module.exports = {
  getProfile,
  saveOnboarding,
  updateProfile,
  getInterests,
  updateInterests,
  getSkills,
  updateSkills,
};
