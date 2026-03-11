'use strict';
const jwt = require('jsonwebtoken');

// Verifies the Authorization: Bearer <token> header.
// Attaches decoded payload to req.user on success.
function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  const token = auth.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    return res.status(401).json({ error: true, code: 'INVALID_TOKEN', message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
