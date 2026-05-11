/**
 * LITERA — Database Layer
 * Uses Neon Serverless Postgres for Cloud, better-sqlite3 for local.
 */
import { neon } from "@neondatabase/serverless";
import path from "path";
import { fileURLToPath } from "url";

const isCloudDB = !!process.env.DATABASE_URL;
const sql = isCloudDB ? neon(process.env.DATABASE_URL) : null;

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
    await sql`
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
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id            SERIAL PRIMARY KEY,
        username      TEXT    NOT NULL UNIQUE,
        password_hash TEXT    NOT NULL,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } else {
    await getSqliteDb();
  }
}

export async function getAllMaterials() {
  await initSchema();
  if (isCloudDB) {
    const rows = await sql`SELECT * FROM materials ORDER BY created_at DESC;`;
    return rows.map(r => ({ ...r, desc: r.description, content: JSON.parse(r.content), quiz: JSON.parse(r.quiz) }));
  } else {
    const db = await getSqliteDb();
    const rows = db.prepare("SELECT * FROM materials ORDER BY created_at DESC").all();
    return rows.map(r => ({ ...r, content: JSON.parse(r.content), quiz: JSON.parse(r.quiz) }));
  }
}

export async function getMaterialById(id) {
  await initSchema();
  if (isCloudDB) {
    const rows = await sql`SELECT * FROM materials WHERE id = ${Number(id)};`;
    if (rows.length === 0) return undefined;
    const r = rows[0];
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
    const rows = await sql`
      INSERT INTO materials (cat, title, description, time, icon, level, content, quiz)
      VALUES (${cat}, ${title}, ${desc || ''}, ${time || '5 mnt'}, ${icon || 'book'}, ${level || 'Pemula'}, ${JSON.stringify(content || [])}, ${JSON.stringify(quiz || [])})
      RETURNING id;
    `;
    return { id: rows[0].id };
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
    await sql`
      UPDATE materials
      SET cat = ${cat}, title = ${title}, description = ${desc}, time = ${time}, icon = ${icon}, level = ${level}, content = ${JSON.stringify(content)}, quiz = ${JSON.stringify(quiz)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(id)};
    `;
    return 1;
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
    await sql`DELETE FROM materials WHERE id = ${Number(id)};`;
    return 1;
  } else {
    const db = await getSqliteDb();
    const info = db.prepare("DELETE FROM materials WHERE id = ?").run(Number(id));
    return info.changes;
  }
}

export async function getAdminByUsername(username) {
  await initSchema();
  if (isCloudDB) {
    const rows = await sql`SELECT * FROM admins WHERE username = ${username};`;
    return rows.length > 0 ? rows[0] : undefined;
  } else {
    const db = await getSqliteDb();
    return db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
  }
}

export async function adminCount() {
  await initSchema();
  if (isCloudDB) {
    const rows = await sql`SELECT COUNT(*) as c FROM admins;`;
    return parseInt(rows[0].c, 10);
  } else {
    const db = await getSqliteDb();
    return db.prepare("SELECT COUNT(*) as c FROM admins").get().c;
  }
}

export async function createAdmin(username, passwordHash) {
  await initSchema();
  if (isCloudDB) {
    const rows = await sql`INSERT INTO admins (username, password_hash) VALUES (${username}, ${passwordHash}) RETURNING id;`;
    return rows[0].id;
  } else {
    const db = await getSqliteDb();
    const info = db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
    return info.lastInsertRowid;
  }
}
