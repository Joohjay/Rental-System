const pool = require('../config/db');

const auditLogger = (action, resourceType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300 && body?.success !== false) {
        const resourceId =
          body?.data?.id || body?.company?.id || body?.property?.id || body?.building?.id || body?.unit?.id || null;

        let description = '';
        if (action === 'CREATE') description = `Created ${resourceType}`;
        else if (action === 'UPDATE') description = `Updated ${resourceType}`;
        else if (action === 'DELETE') description = `Deleted ${resourceType}`;

        try {
          await pool.query(
            `INSERT INTO activity_logs (company_id, user_id, user_name, user_role, action, resource_type, resource_id, description, ip_address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              req.user?.company_id || null,
              req.user?.id || null,
              req.user?.name || 'System',
              req.user?.role || null,
              action,
              resourceType,
              resourceId,
              description,
              req.ip || req.connection?.remoteAddress || null,
            ]
          );
        } catch (err) {
          console.error('Audit log error:', err.message);
        }
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLogger;
