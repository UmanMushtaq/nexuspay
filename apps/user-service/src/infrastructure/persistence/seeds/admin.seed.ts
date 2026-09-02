import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

async function seedAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5438,
    user: 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'user_db',
  });

  await client.connect();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexuspay.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';

  const existing = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

  if (existing.rows.length > 0) {
    console.log(`Admin already exists: ${adminEmail}`);
    await client.end();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const id = crypto.randomUUID();

  await client.query(
    `INSERT INTO users (
      id, email, "passwordHash", "firstName", "lastName",
      "dateOfBirth", nationality, phone, role, "kycStatus",
      "isEmailVerified", "isPhoneVerified", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())`,
    [
      id,
      adminEmail,
      passwordHash,
      'Admin',
      'User',
      '1990-01-01',
      'N/A',
      '0000000000',
      'ADMIN',
      'VERIFIED',
      true,
      true,
    ],
  );

  console.log(`✅ Admin user created: ${adminEmail}`);
  console.log(`   Password: ${adminPassword} (change this after first login)`);
  await client.end();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});