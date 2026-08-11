import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlPath = path.resolve(__dirname, '../../sql/init.sql');

export async function initDb() {
  const sql = await fs.readFile(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('PostgreSQL: tabelas verificadas/criadas.');
}
