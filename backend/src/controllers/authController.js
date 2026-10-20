const bcrypt = require('bcryptjs');
const { executeQuery, sql } = require('../config/db');
const { signToken } = require('../config/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { full_name, email, password } = req.body;

    // Check if email already exists
    const existing = await executeQuery(
      'SELECT id FROM dbo.LifeOSUsers WHERE email = @email',
      [{ name: 'email', type: sql.NVarChar(255), value: email.toLowerCase() }]
    );

    if (existing.recordset && existing.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Hash password with bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const insertResult = await executeQuery(
      `INSERT INTO dbo.LifeOSUsers (full_name, email, password_hash, created_at, updated_at)
       OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.created_at
       VALUES (@full_name, @email, @password_hash, SYSUTCDATETIME(), SYSUTCDATETIME())`,
      [
        { name: 'full_name', type: sql.NVarChar(255), value: full_name.trim() },
        { name: 'email', type: sql.NVarChar(255), value: email.toLowerCase().trim() },
        { name: 'password_hash', type: sql.NVarChar(255), value: password_hash },
      ]
    );

    const newUser = insertResult.recordset[0];

    // Split name into first and last for profile defaults
    const parts = full_name.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // Create initial profile record
    await executeQuery(
      `INSERT INTO dbo.LifeOSProfiles (user_id, first_name, last_name, onboarding_completed, created_at, updated_at)
       VALUES (@userId, @firstName, @lastName, 0, SYSUTCDATETIME(), SYSUTCDATETIME())`,
      [
        { name: 'userId', type: sql.Int, value: newUser.id },
        { name: 'firstName', type: sql.NVarChar(100), value: firstName },
        { name: 'lastName', type: sql.NVarChar(100), value: lastName },
      ]
    );

    // Generate JWT
    const token = signToken({ userId: newUser.id, email: newUser.email });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to LifeOS!',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        onboardingCompleted: false,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login existing user
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const userResult = await executeQuery(
      `SELECT u.id, u.full_name, u.email, u.password_hash,
              ISNULL(p.onboarding_completed, 0) AS onboarding_completed,
              p.first_name, p.last_name
       FROM dbo.LifeOSUsers u
       LEFT JOIN dbo.LifeOSProfiles p ON u.id = p.user_id
       WHERE u.email = @email`,
      [{ name: 'email', type: sql.NVarChar(255), value: email.toLowerCase().trim() }]
    );

    if (!userResult.recordset || userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const user = userResult.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        firstName: user.first_name || user.full_name.split(' ')[0],
        lastName: user.last_name || '',
        email: user.email,
        onboardingCompleted: Boolean(user.onboarding_completed),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current authenticated user details
 * GET /api/auth/me
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await executeQuery(
      `SELECT u.id, u.full_name, u.email, u.created_at,
              ISNULL(p.onboarding_completed, 0) AS onboarding_completed,
              p.first_name, p.last_name, p.skill_level, p.primary_goal,
              p.daily_available_minutes, p.learning_style
       FROM dbo.LifeOSUsers u
       LEFT JOIN dbo.LifeOSProfiles p ON u.id = p.user_id
       WHERE u.id = @userId`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = result.recordset[0];
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        firstName: user.first_name || user.full_name.split(' ')[0],
        lastName: user.last_name || '',
        email: user.email,
        onboardingCompleted: Boolean(user.onboarding_completed),
        skillLevel: user.skill_level,
        primaryGoal: user.primary_goal,
        dailyAvailableMinutes: user.daily_available_minutes,
        learningStyle: user.learning_style,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user password
 * PUT /api/auth/password
 */
async function updatePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.',
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    // Verify current password
    const userResult = await executeQuery(
      'SELECT password_hash FROM dbo.LifeOSUsers WHERE id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    if (!userResult.recordset || userResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, userResult.recordset[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);

    await executeQuery(
      `UPDATE dbo.LifeOSUsers
       SET password_hash = @hash, updated_at = SYSUTCDATETIME()
       WHERE id = @userId`,
      [
        { name: 'hash', type: sql.NVarChar(255), value: newHash },
        { name: 'userId', type: sql.Int, value: userId },
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout
 * POST /api/auth/logout
 */
function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
  logout,
};
