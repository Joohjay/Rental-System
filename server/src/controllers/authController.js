const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const data = await authService.registerUser({ name, email, phone, password, role });

    res.status(201).json({ success: true, message: 'Registration successful', ...data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });

    res.json({ success: true, message: 'Login successful', ...data });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };
