const applicantService = require('../services/applicantService');

const listAll = async (req, res, next) => {
  try {
    const result = await applicantService.listAll(req.user.company_id, req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const applicant = await applicantService.getById(req.params.id, req.user.company_id);
    res.json({ success: true, data: applicant });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const result = await applicantService.updateStatus(req.params.id, req.user.company_id, req.body.status, req.user.id);
    res.json({ success: true, message: `Application ${req.body.status}`, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { listAll, getById, updateStatus };
