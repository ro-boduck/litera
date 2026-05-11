/**
 * LITERA — Database Layer
 * Uses pg (PostgreSQL) for Cloud (Vercel Postgres/Neon), better-sqlite3 for local.
 */
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const cloudUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const isCloudDB = !!cloudUrl;

let _pool = null;
if (isCloudDB) {
  _pool = new Pool({
    connectionString: cloudUrl,
    ssl: { rejectUnauthorized: false }, // Vercel Postgres requires SSL
  });
}

let _sqliteDb = null;
async function getSqliteDb() {
  if (_sqliteDb) return _sqliteDb;
  const Database = (await import("better-sqlite3")).default;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const DB_PATH = path.join(__dirname, "..", "litera.db");

  _sqliteDb = new Database(DB_PATH);
  _sqliteDb.pragma("journal_mode = WAL");
  _sqliteDb.pragma("foreign_keys = ON");
  _sqliteDb.pragma("synchronous = NORMAL");
  
  _sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      cat     TEXT    NOT NULL,
      title   TEXT    NOT NULL,
      desc    TEXT    NOT NULL DEFAULT '',
      time    TEXT    NOT NULL DEFAULT '5 mnt',
      icon    TEXT    NOT NULL DEFAULT 'book',
      level   TEXT    NOT NULL DEFAULT 'Pemula',
      content TEXT    NOT NULL DEFAULT '[]',
      quiz    TEXT    NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS admins (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return _sqliteDb;
}

export async function initSchema() {
  if (isCloudDB) {
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id      SERIAL PRIMARY KEY,
        cat     TEXT    NOT NULL,
        title   TEXT    NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        time    TEXT    NOT NULL DEFAULT '5 mnt',
        icon    TEXT    NOT NULL DEFAULT 'book',
        level   TEXT    NOT NULL DEFAULT 'Pemula',
        content TEXT    NOT NULL DEFAULT '[]',
        quiz    TEXT    NOT NULL DEFAULT '[]',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id            SERIAL PRIMARY KEY,
        username      TEXT    NOT NULL UNIQUE,
        password_hash TEXT    NOT NULL,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else {
    await getSqliteDb();
  }
}

export async function getAllMaterials() {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("SELECT * FROM materials ORDER BY created_at DESC");
    return res.rows.map(r => ({ ...r, desc: r.description, content: JSON.parse(r.content), quiz: JSON.parse(r.quiz) }));
  } else {
    const db = await getSqliteDb();
    const rows = db.prepare("SELECT * FROM materials ORDER BY created_at DESC").all();
    return rows.map(r => ({ ...r, content: JSON.parse(r.content), quiz: JSON.parse(r.quiz) }));
  }
}

export async function getMaterialById(id) {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("SELECT * FROM materials WHERE id = $1", [Number(id)]);
    if (res.rows.length === 0) return undefined;
    const r = res.rows[0];
    return { ...r, desc: r.description, content: JSON.parse(r.content), quiz: JSON.parse(r.quiz) };
  } else {
    const db = await getSqliteDb();
    const row = db.prepare("SELECT * FROM materials WHERE id = ?").get(Number(id));
    if (!row) return undefined;
    return { ...row, content: JSON.parse(row.content), quiz: JSON.parse(row.quiz) };
  }
}

export async function createMaterial(data) {
  await initSchema();
  const { cat, title, desc, time, icon, level, content, quiz } = data;
  if (isCloudDB) {
    const res = await _pool.query(`
      INSERT INTO materials (cat, title, description, time, icon, level, content, quiz)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [cat, title, desc || '', time || '5 mnt', icon || 'book', level || 'Pemula', JSON.stringify(content || []), JSON.stringify(quiz || [])]);
    return { id: res.rows[0].id };
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(`
      INSERT INTO materials (cat, title, desc, time, icon, level, content, quiz)
      VALUES (@cat, @title, @desc, @time, @icon, @level, @content, @quiz)
    `);
    const info = stmt.run({ cat, title, desc: desc || '', time: time || '5 mnt', icon: icon || 'book', level: level || 'Pemula', content: JSON.stringify(content || []), quiz: JSON.stringify(quiz || []) });
    return { id: info.lastInsertRowid };
  }
}

export async function updateMaterial(id, data) {
  await initSchema();
  const { cat, title, desc, time, icon, level, content, quiz } = data;
  if (isCloudDB) {
    const res = await _pool.query(`
      UPDATE materials
      SET cat = $1, title = $2, description = $3, time = $4, icon = $5, level = $6, content = $7, quiz = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
    `, [cat, title, desc, time, icon, level, JSON.stringify(content), JSON.stringify(quiz), Number(id)]);
    return res.rowCount;
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(`
      UPDATE materials 
      SET cat = @cat, title = @title, desc = @desc, time = @time, icon = @icon, level = @level, content = @content, quiz = @quiz, updated_at = datetime('now')
      WHERE id = @id
    `);
    const info = stmt.run({ id: Number(id), cat, title, desc, time, icon, level, content: JSON.stringify(content), quiz: JSON.stringify(quiz) });
    return info.changes;
  }
}

export async function deleteMaterial(id) {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("DELETE FROM materials WHERE id = $1", [Number(id)]);
    return res.rowCount;
  } else {
    const db = await getSqliteDb();
    const info = db.prepare("DELETE FROM materials WHERE id = ?").run(Number(id));
    return info.changes;
  }
}

export async function getAdminByUsername(username) {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    return res.rows.length > 0 ? res.rows[0] : undefined;
  } else {
    const db = await getSqliteDb();
    return db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
  }
}

export async function adminCount() {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("SELECT COUNT(*) as c FROM admins");
    return parseInt(res.rows[0].c, 10);
  } else {
    const db = await getSqliteDb();
    return db.prepare("SELECT COUNT(*) as c FROM admins").get().c;
  }
}

export async function createAdmin(username, passwordHash) {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id", [username, passwordHash]);
    return res.rows[0].id;
  } else {
    const db = await getSqliteDb();
    const info = db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
    return info.lastInsertRowid;
  }
}
