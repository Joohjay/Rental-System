require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const pool = require('./db');

const seed = async () => {
  console.log('Seeding users...');

  const hash = await bcrypt.hash('Test@123', 12);
  const adminHash = await bcrypt.hash('Admin@123', 12);

  const users = [
    ['super@rentflow.com', 'Super Admin',    adminHash, 'SUPER_ADMIN',    null],
    ['owner@rentflow.com',  'Jane Owner',    hash,      'COMPANY_OWNER',  1],
    ['manager@rentflow.com','John Manager',  hash,      'PROPERTY_MANAGER',1],
    ['caretaker@rentflow.com','James Caretaker',hash,   'CARETAKER',      1],
    ['accountant@rentflow.com','Alice Accountant',hash, 'ACCOUNTANT',     1],
    ['applicant@rentflow.com','Bob Applicant',hash,     'APPLICANT',      null],
    ['tenant@rentflow.com',   'Sarah Tenant', hash,     'TENANT',         1],
    ['former@rentflow.com',   'Tom Former',   hash,     'FORMER_TENANT',  null],
  ];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [email, name, pw, role, company_id] of users) {
      await conn.execute(
        `INSERT IGNORE INTO users (name, email, password_hash, role, company_id) VALUES (?, ?, ?, ?, ?)`,
        [name, email, pw, role, company_id]
      );
    }
    await conn.commit();
    console.log(`Seeded ${users.length} users successfully.`);
  } catch (err) {
    await conn.rollback();
    console.error('Seed failed:', err.message);
  } finally {
    conn.release();
  }
  process.exit(0);
};

seed();
