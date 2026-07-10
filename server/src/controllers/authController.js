const authService = require('../services/authService');

const registerApplicant = async (req, res, next) => {
  try {
    const data = await authService.registerApplicant(req.body);
    res.status(201).json({ success: true, message: 'Registration successful', ...data });
  } catch (err) {
    next(err);
  }
};

const registerCompanyOwner = async (req, res, next) => {
  try {
    const data = await authService.registerCompanyOwner(req.body);
    res.status(201).json({ success: true, message: 'Company created successfully', ...data });
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

module.exports = { registerApplicant, registerCompanyOwner, login, getMe, logout };
