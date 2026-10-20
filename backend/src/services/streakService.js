const { executeQuery, sql } = require('../config/db');

/**
 * Calculates current streak (consecutive days with completed tasks) for a user
 * based on verified records in LifeOSDailyProgress.
 *
 * @param {number} userId
 * @returns {Promise<number>} Current consecutive streak count
 */
async function calculateUserStreak(userId) {
  try {
    const result = await executeQuery(
      `SELECT CONVERT(VARCHAR(10), progress_date, 23) AS progress_date, completed_tasks, completion_percentage
       FROM dbo.LifeOSDailyProgress
       WHERE user_id = @userId AND completed_tasks > 0
       ORDER BY progress_date DESC`,
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    const records = result.recordset || [];
    if (records.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecentDateStr = records[0].progress_date;
    const mostRecentDate = new Date(mostRecentDateStr);
    mostRecentDate.setHours(0, 0, 0, 0);

    // If most recent is neither today nor yesterday, streak is broken
    const diffFromToday = Math.round((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    if (diffFromToday > 1) {
      return 0;
    }

    let expectedDate = new Date(mostRecentDate);

    for (const record of records) {
      const recDate = new Date(record.progress_date);
      recDate.setHours(0, 0, 0, 0);

      const diff = Math.round((expectedDate - recDate) / (1000 * 60 * 60 * 24));
      if (diff === 0) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Streak calculation error:', error);
    return 0;
  }
}

module.exports = {
  calculateUserStreak,
};
