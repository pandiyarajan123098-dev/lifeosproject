const { executeQuery, sql } = require('../config/db');
const { calculateUserStreak } = require('../services/streakService');

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get comprehensive dashboard statistics for the authenticated user
 * GET /api/dashboard/stats
 */
async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;
    const today = getTodayDateString();

    // 1. Fetch user & profile info
    const profileRes = await executeQuery(
      `SELECT u.full_name, u.email,
              ISNULL(p.first_name, u.full_name) AS first_name,
              p.last_name, p.skill_level, p.primary_goal, p.secondary_goal,
              p.daily_available_minutes, p.learning_style, p.onboarding_completed
       FROM dbo.LifeOSUsers u
       LEFT JOIN dbo.LifeOSProfiles p ON u.id = p.user_id
       WHERE u.id = @userId`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    const userProfile = profileRes.recordset[0] || {};
    const firstName = userProfile.first_name || req.user.full_name?.split(' ')[0] || 'User';

    // 2. Fetch today's tasks
    const todayTasksRes = await executeQuery(
      `SELECT id, task_title, task_description, category,
              estimated_minutes, priority, CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              is_completed, completed_at
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date = @today
       ORDER BY is_completed ASC, priority DESC, id ASC`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'today', type: sql.Date, value: today },
      ]
    );

    const todayTasks = todayTasksRes.recordset || [];
    const totalToday = todayTasks.length;
    const completedToday = todayTasks.filter((t) => t.is_completed).length;
    const todayPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    // 3. Calculate actual consecutive days streak
    const streak = await calculateUserStreak(userId);

    // 4. Fetch past 7 days progress for weekly chart
    // Generate array of past 7 dates
    const weeklyChartData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      weeklyChartData.push({
        date: dStr,
        day: dayLabel,
        total: 0,
        completed: 0,
        percentage: 0,
      });
    }

    const minDate = weeklyChartData[0].date;
    const maxDate = weeklyChartData[weeklyChartData.length - 1].date;

    const weeklyProgressRes = await executeQuery(
      `SELECT CONVERT(VARCHAR(10), task_date, 23) AS task_date,
              COUNT(*) AS total,
              SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completed
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND task_date >= @minDate AND task_date <= @maxDate
       GROUP BY task_date`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'minDate', type: sql.Date, value: minDate },
        { name: 'maxDate', type: sql.Date, value: maxDate },
      ]
    );

    const dateMap = {};
    for (const r of weeklyProgressRes.recordset || []) {
      const total = r.total || 0;
      const completed = r.completed || 0;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      dateMap[r.task_date] = { total, completed, percentage: pct };
    }

    const chart = weeklyChartData.map((item) => {
      const recorded = dateMap[item.date];
      return {
        ...item,
        total: recorded ? recorded.total : 0,
        completed: recorded ? recorded.completed : 0,
        percentage: recorded ? recorded.percentage : 0,
      };
    });

    // 5. Fetch user interests and skills
    const interestsRes = await executeQuery(
      'SELECT interest_name FROM dbo.LifeOSInterests WHERE user_id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const interests = (interestsRes.recordset || []).map((r) => r.interest_name);

    const skillsRes = await executeQuery(
      'SELECT skill_name, proficiency_level FROM dbo.LifeOSSkills WHERE user_id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const skills = (skillsRes.recordset || []).map((r) => ({
      name: r.skill_name,
      level: r.proficiency_level,
    }));

    // 6. Fetch recent activity (recently completed tasks or daily submissions)
    const recentActivityRes = await executeQuery(
      `SELECT TOP 6 id, task_title, category, is_completed, completed_at, created_at,
              CONVERT(VARCHAR(10), task_date, 23) AS task_date
       FROM dbo.LifeOSTasks
       WHERE user_id = @userId AND is_completed = 1
       ORDER BY completed_at DESC, id DESC`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );
    const recentActivity = recentActivityRes.recordset || [];

    return res.status(200).json({
      success: true,
      data: {
        greeting: `Welcome back, ${firstName}!`,
        firstName,
        fullName: userProfile.full_name,
        todayDate: today,
        primaryGoal: userProfile.primary_goal || 'Set your primary goal in Profile',
        secondaryGoal: userProfile.secondary_goal || '',
        skillLevel: userProfile.skill_level || 'Beginner',
        dailyAvailableMinutes: userProfile.daily_available_minutes || 60,
        onboardingCompleted: Boolean(userProfile.onboarding_completed),
        todayStats: {
          total: totalToday,
          completed: completedToday,
          percentage: todayPercentage,
        },
        streak,
        weeklyChart: chart,
        interests,
        skills,
        recentActivity,
        todayTasks,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};
