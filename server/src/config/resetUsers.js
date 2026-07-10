require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const pool = require('./db');

const reset = async () => {
  const hash = await bcrypt.hash('Test@123', 12);
  const adminHash = await bcrypt.hash('Admin@123', 12);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete dependent rows first (foreign keys)
    await conn.execute('DELETE FROM activity_logs');
    await conn.execute('DELETE FROM saved_properties');
    await conn.execute('DELETE FROM notifications');
    await conn.execute('DELETE FROM reviews');
    await conn.execute('DELETE FROM viewing_requests');
    await conn.execute('DELETE FROM application_documents');
    await conn.execute('DELETE FROM applications');
    await conn.execute('DELETE FROM invitations');
    await conn.execute('DELETE FROM users');

    // Insert 3 users
    await conn.execute(
      `INSERT INTO users (name, email, password_hash, role, company_id) VALUES (?, ?, ?, ?, ?)`,
      ['Super Admin', 'admin@rentflow.com', adminHash, 'SUPER_ADMIN', null]
    );
    await conn.execute(
      `INSERT INTO users (name, email, password_hash, role, company_id) VALUES (?, ?, ?, ?, ?)`,
      ['Jane Owner', 'owner@rentflow.com', hash, 'COMPANY_OWNER', 1]
    );
    await conn.execute(
      `INSERT INTO users (name, email, password_hash, role, company_id) VALUES (?, ?, ?, ?, ?)`,
      ['Bob Applicant', 'applicant@rentflow.com', hash, 'APPLICANT', null]
    );

    await conn.commit();
    console.log('Reset complete. 3 users created.');
  } catch (err) {
    await conn.rollback();
    console.error('Failed:', err.message);
  } finally {
    conn.release();
  }
  process.exit(0);
};

reset();
