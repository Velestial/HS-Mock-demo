'use strict';
const router = require('express').Router();

// Phase 2 placeholder — JWT auth routes will replace these stubs
router.post('/auth/login', (req, res) => {
  res.status(501).json({ error: true, code: 'NOT_IMPLEMENTED', message: 'JWT auth implemented in Phase 2' });
});

router.post('/auth/refresh', (req, res) => {
  res.status(501).json({ error: true, code: 'NOT_IMPLEMENTED', message: 'JWT auth implemented in Phase 2' });
});

router.post('/auth/logout', (req, res) => {
  res.status(501).json({ error: true, code: 'NOT_IMPLEMENTED', message: 'JWT auth implemented in Phase 2' });
});

module.exports = router;
