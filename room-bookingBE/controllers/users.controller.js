const { users, students } = require('../data/mockData');

// ─── Helper ──────────────────────────────────────────────────────────────────

function resolveUser(req, res) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) { res.status(401).json({ message: 'Missing authorization token.' }); return null; }

  const userId = token.replace('mock-jwt-', '');
  const user = users.find((u) => u._id === userId);
  if (!user) { res.status(401).json({ message: 'Invalid or expired token.' }); return null; }
  return user;
}

// ─── GET /api/users/me ────────────────────────────────────────────────────────

const getMe = (req, res) => {
  const user = resolveUser(req, res);
  if (!user) return;
  const { passwordHash, ...safeUser } = user;
  const profile = students.find((s) => s.userId === user._id) || null;
  return res.json({ user: safeUser, profile });
};

// ─── GET /api/profile ─────────────────────────────────────────────────────────

const getProfile = (req, res) => {
  const user = resolveUser(req, res);
  if (!user) return;
  const { passwordHash, ...safeUser } = user;
  const profile = students.find((s) => s.userId === user._id) || null;
  return res.json({ user: safeUser, profile });
};

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
// Editable fields: phone, avatarUrl

const updateProfile = (req, res) => {
  const user = resolveUser(req, res);
  if (!user) return;

  const profile = students.find((s) => s.userId === user._id);
  if (!profile) return res.status(404).json({ message: 'Student profile not found.' });

  const { phone, avatarUrl } = req.body;

  if (phone !== undefined) {
    if (typeof phone !== 'string' || phone.trim() === '') {
      return res.status(400).json({ message: 'Phone must be a non-empty string.' });
    }
    profile.phone = phone.trim();
  }

  if (avatarUrl !== undefined) {
    profile.avatarUrl = avatarUrl;
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({ message: 'Profile updated successfully.', user: safeUser, profile });
};

// ─── PUT /api/profile/change-password ────────────────────────────────────────

const changePassword = (req, res) => {
  const user = resolveUser(req, res);
  if (!user) return;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword and newPassword are required.' });
  }

  if (user.passwordHash !== currentPassword) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }

  user.passwordHash = newPassword;   // plain text for mock — real app would bcrypt here
  return res.json({ message: 'Password changed successfully.' });
};

module.exports = { getMe, getProfile, updateProfile, changePassword };
