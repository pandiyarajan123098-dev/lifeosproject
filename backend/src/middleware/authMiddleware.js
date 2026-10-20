const { verifyToken } = require('../config/jwt');
const { executeQuery, sql } = require('../config/db');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }

    // Verify user still exists in database
    const userResult = await executeQuery(
      'SELECT id, full_name, email FROM dbo.LifeOSUsers WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: decoded.userId }]
    );

    if (!userResult.recordset || userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    req.user = userResult.recordset[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed due to an internal server error.',
    });
  }
}

module.exports = authenticateToken;
