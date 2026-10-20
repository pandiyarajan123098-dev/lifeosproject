const { executeQuery, sql } = require('../config/db');
const { generateDailyTasks } = require('../services/taskGeneratorService');

/**
 * Helper to get current UTC date string YYYY-MM-DD
 */
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get all tasks for today for the authenticated user
 * GET /api/tasks/today
 */
async function getTodayTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const today = getTodayDateString();

    const tasksResult = await executeQuery(
      `SELECT id, user_id, task_title, task_description, category,
              estimated_minutes, priority, CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              is_completed, completed_at, created_at
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @today
       ORDER BY is_completed ASC, priority DESC, id ASC`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    const tasks = tasksResult.recordset || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.is_completed).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Check if daily progress snapshot was submitted
    const progressResult = await executeQuery(
      `SELECT id, total_tasks, completed_tasks, completion_percentage, submitted_at
       FROM dbo.LifeOSDailyProgress
       WHERE user_id = @userId AND progress_date = @today`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    const isSubmitted = progressResult.recordset && progressResult.recordset.length > 0;

    return res.status(200).json({
      success: true,
      date: today,
      hasTasks: totalTasks > 0,
      isSubmitted,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        percentage: completionPercentage,
      },
      tasks,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generate daily tasks based on user profile, interests, and skills
 * POST /api/tasks/generate
 */
async function generateTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const today = getTodayDateString();
    const { regenerate = false } = req.body;

    // Check if tasks already exist for today
    const existingResult = await executeQuery(
      `SELECT id, task_title, task_description, category,
              estimated_minutes, priority, CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              is_completed, completed_at, created_at
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @today
       ORDER BY is_completed ASC, id ASC`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    // If tasks exist and user didn't explicitly ask to regenerate, return existing
    if (existingResult.recordset && existingResult.recordset.length > 0 && !regenerate) {
      const existing = existingResult.recordset;
      const total = existing.length;
      const completed = existing.filter((t) => t.is_completed).length;
      return res.status(200).json({
        success: true,
        message: "Today's tasks already generated.",
        tasks: existing,
        stats: {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      });
    }

    // Fetch user profile
    const profileRes = await executeQuery(
      `SELECT skill_level, primary_goal, daily_available_minutes, learning_style, preferred_task_count
       FROM dbo.LifeOSProfiles
       WHERE user_id = @userId`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const profile = profileRes.recordset[0] || {};

    // Fetch user interests
    const interestsRes = await executeQuery(
      'SELECT interest_name FROM dbo.LifeOSInterests WHERE user_id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const interests = interestsRes.recordset.map((r) => r.interest_name);

    // Fetch user skills
    const skillsRes = await executeQuery(
      'SELECT skill_name, proficiency_level FROM dbo.LifeOSSkills WHERE user_id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const skills = skillsRes.recordset.map((r) => ({
      skill_name: r.skill_name,
      level: r.proficiency_level,
    }));

    // Fetch recent past task titles to prevent repetition
    const pastTasksRes = await executeQuery(
      `SELECT DISTINCT TOP 20 task_title
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date < @today
       ORDER BY task_title`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );
    const recentTitles = pastTasksRes.recordset.map((r) => r.task_title);

    // Generate personalized tasks using recommendation engine
    const recommendedTasks = generateDailyTasks({
      profile,
      interests,
      skills,
      taskDate: today,
      recentTitles,
    });

    // If regenerating, remove existing uncompleted tasks for today to avoid duplicate clutter
    if (regenerate) {
      await executeQuery(
        `DELETE FROM dbo.LifeOSTasks WHERE user_id = @userId AND task_date = @today AND is_completed = 0`,
        [
          { name: 'userId', type: sql.Int, value: userId },
          { name: 'today', type: sql.Date, value: today },
        ]
      );
    }

    // Insert new tasks
    for (const t of recommendedTasks) {
      await executeQuery(
        `INSERT INTO dbo.LifeOSTasks (
          user_id, task_title, task_description, category,
          estimated_minutes, priority, task_date, is_completed, created_at
        ) VALUES (
          @userId, @title, @desc, @cat,
          @minutes, @priority, @date, 0, SYSUTCDATETIME()
        )`,
        [
          { name: 'userId', type: sql.Int, value: userId },
          { name: 'title', type: sql.NVarChar(255), value: t.task_title },
          { name: 'desc', type: sql.NVarChar(sql.MAX), value: t.task_description },
          { name: 'cat', type: sql.NVarChar(100), value: t.category },
          { name: 'minutes', type: sql.Int, value: t.estimated_minutes },
          { name: 'priority', type: sql.NVarChar(50), value: t.priority },
          { name: 'date', type: sql.Date, value: today },
        ]
      );
    }

    // Fetch newly inserted tasks
    const newTasksRes = await executeQuery(
      `SELECT id, user_id, task_title, task_description, category,
              estimated_minutes, priority, CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              is_completed, completed_at, created_at
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @today
       ORDER BY is_completed ASC, id ASC`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    const tasks = newTasksRes.recordset || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.is_completed).length;

    return res.status(201).json({
      success: true,
      message: "Personalized daily tasks generated successfully!",
      tasks,
      stats: {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle task completion status
 * PATCH /api/tasks/:id
 */
async function toggleTask(req, res, next) {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);
    const { is_completed } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }

    // Check ownership
    const checkResult = await executeQuery(
      'SELECT id, task_date FROM dbo.LifeOSTasks WHERE id = @taskId AND user_id = @userId',
      [
        { name: 'taskId', type: sql.Int, value: taskId },
        { name: 'userId', type: sql.Int, value: userId },
      ]
    );

    if (!checkResult.recordset || checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to update it.',
      });
    }

    const taskDate = checkResult.recordset[0].task_date;
    const completedVal = is_completed ? 1 : 0;

    // Update completion
    await executeQuery(
      `UPDATE dbo.LifeOSTasks
       SET is_completed = @isCompleted,
           completed_at = CASE WHEN @isCompleted = 1 THEN SYSUTCDATETIME() ELSE NULL END
       WHERE id = @taskId AND user_id = @userId`,
      [
        { name: 'isCompleted', type: sql.Bit, value: completedVal },
        { name: 'taskId', type: sql.Int, value: taskId },
        { name: 'userId', type: sql.Int, value: userId },
      ]
    );

    // Fetch updated task
    const updatedRes = await executeQuery(
      `SELECT id, user_id, task_title, task_description, category,
              estimated_minutes, priority, CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              is_completed, completed_at
       FROM dbo.LifeOSTasks
       WHERE id = @taskId`,
      [{ name: 'taskId', type: sql.Int, value: taskId }]
    );

    // Fetch today's current totals
    const statsRes = await executeQuery(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completed
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @taskDate`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'taskDate', type: sql.Date, value: taskDate },
      ]
    );

    const statsRow = statsRes.recordset[0] || { total: 0, completed: 0 };
    const total = statsRow.total || 0;
    const completed = statsRow.completed || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: completedVal ? 'Task marked as completed.' : 'Task marked as incomplete.',
      task: updatedRes.recordset[0],
      stats: { total, completed, percentage },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Submit daily progress snapshot
 * POST /api/tasks/submit
 */
async function submitDailyProgress(req, res, next) {
  try {
    const userId = req.user.id;
    const today = getTodayDateString();

    // Calculate actual task counts
    const countRes = await executeQuery(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completed
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @today`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    const total = countRes.recordset[0]?.total || 0;
    const completed = countRes.recordset[0]?.completed || 0;
    const percentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0.0;

    // Upsert snapshot into LifeOSDailyProgress
    await executeQuery(
      `IF EXISTS (SELECT 1 FROM dbo.LifeOSDailyProgress WHERE user_id = @userId AND progress_date = @today)
       BEGIN
         UPDATE dbo.LifeOSDailyProgress
         SET total_tasks = @total,
             completed_tasks = @completed,
             completion_percentage = @pct,
             submitted_at = SYSUTCDATETIME()
         WHERE user_id = @userId AND progress_date = @today;
       END
       ELSE
       BEGIN
         INSERT INTO dbo.LifeOSDailyProgress (
           user_id, progress_date, total_tasks, completed_tasks,
           completion_percentage, submitted_at
         ) VALUES (
           @userId, @today, @total, @completed,
           @pct, SYSUTCDATETIME()
         );
       END`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
        { name: 'total', type: sql.Int, value: total },
        { name: 'completed', type: sql.Int, value: completed },
        { name: 'pct', type: sql.Decimal(5, 2), value: percentage },
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Daily progress recorded and snapshot submitted successfully!',
      progress: {
        date: today,
        totalTasks: total,
        completedTasks: completed,
        completionPercentage: percentage,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get historical tasks and progress
 * GET /api/tasks/history
 */
async function getTaskHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { startDate, endDate, search, status } = req.query;

    let query = `
      SELECT t.id, t.user_id, t.task_title, t.task_description, t.category,
             t.estimated_minutes, t.priority, CONVERT(VARCHAR(10), t.task_date, 23) AS task_date,
             t.is_completed, t.completed_at, t.created_at
      FROM dbo.LifeOSTasks t
      WHERE t.user_id = @userId
    `;

    const params = [{ name: 'userId', type: sql.Int, value: userId }];

    if (startDate) {
      query += ` AND t.task_date >= @startDate`;
      params.push({ name: 'startDate', type: sql.Date, value: startDate });
    }

    if (endDate) {
      query += ` AND t.task_date <= @endDate`;
      params.push({ name: 'endDate', type: sql.Date, value: endDate });
    }

    if (search && search.trim()) {
      query += ` AND (t.task_title LIKE @search OR t.category LIKE @search OR t.task_description LIKE @search)`;
      params.push({ name: 'search', type: sql.NVarChar(255), value: `%${search.trim()}%` });
    }

    if (status === 'completed') {
      query += ` AND t.is_completed = 1`;
    } else if (status === 'incomplete') {
      query += ` AND t.is_completed = 0`;
    }

    query += ` ORDER BY t.task_date DESC, t.id ASC`;

    const tasksRes = await executeQuery(query, params);
    const tasks = tasksRes.recordset || [];

    // Also get daily progress snapshots
    const progressRes = await executeQuery(
      `SELECT CONVERT(VARCHAR(10), progress_date, 23) AS progress_date,
              total_tasks, completed_tasks, completion_percentage, submitted_at
       FROM dbo.LifeOSDailyProgress
       WHERE user_id = @userId
       ORDER BY progress_date DESC`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    return res.status(200).json({
      success: true,
      tasks,
      dailyProgress: progressRes.recordset || [],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTodayTasks,
  generateTasks,
  toggleTask,
  submitDailyProgress,
  getTaskHistory,
};
