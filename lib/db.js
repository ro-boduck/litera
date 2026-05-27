/**
 * @fileoverview Database integration layer for LITERA.
 * Supports PostgreSQL (via pg Pool) for cloud environments (Vercel/Neon) 
 * and fallback SQLite (via better-sqlite3) for local development.
 */
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import seedData from "./seed_data.json" with { type: "json" };


const { Pool } = pg;
const cloudUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const isCloudDB = !!cloudUrl;

let _pool = null;
if (isCloudDB) {
  _pool = new Pool({
    connectionString: cloudUrl,
    ssl: { rejectUnauthorized: false }, // Cloud server database integrations require SSL
  });
}

let _sqliteDb = null;
/**
 * Initializes and configures the local SQLite database connection.
 * Sets WAL mode and foreign key constraints for optimization and data integrity.
 * @returns {Promise<object>} The active SQLite database connection instance.
 */
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
    CREATE TABLE IF NOT EXISTS messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT    NOT NULL DEFAULT '',
      message     TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return _sqliteDb;
}

let _initialized = false;
/**
 * Initializes the database schemas and auto-seeds initial materials if empty.
 * Runs table creation for both cloud PostgreSQL and local SQLite depending on environment variables.
 * @returns {Promise<void>}
 */
export async function initSchema() {
  if (_initialized) return;
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
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id          SERIAL PRIMARY KEY,
        name        TEXT    NOT NULL,
        email       TEXT    NOT NULL,
        phone       TEXT    NOT NULL DEFAULT '',
        message     TEXT    NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Automatically seed default materials if table is empty
    try {
      const countRes = await _pool.query("SELECT COUNT(*) as c FROM materials");
      const count = parseInt(countRes.rows[0].c, 10);
      if (count === 0) {
        console.log("[DB] Seeding default materials in Cloud PostgreSQL database...");
        for (const m of seedData) {
          await _pool.query(`
            INSERT INTO materials (id, cat, title, description, time, icon, level, content, quiz, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            m.id,
            m.cat,
            m.title,
            m.desc,
            m.time,
            m.icon,
            m.level,
            m.content,
            m.quiz,
            m.created_at,
            m.updated_at
          ]);
        }
        await _pool.query("SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials))");
        console.log("[DB] Cloud seeding completed successfully!");
      }
    } catch (err) {
      console.error("[DB] Seeding materials failed:", err);
    }
  } else {
    const db = await getSqliteDb();
    // Auto-seed SQLite materials if empty
    try {
      const count = db.prepare("SELECT COUNT(*) as c FROM materials").get().c;
      if (count === 0) {
        console.log("[DB] Seeding default materials in local SQLite database...");
        const stmt = db.prepare(`
          INSERT INTO materials (id, cat, title, desc, time, icon, level, content, quiz, created_at, updated_at)
          VALUES (@id, @cat, @title, @desc, @time, @icon, @level, @content, @quiz, @created_at, @updated_at)
        `);
        for (const m of seedData) {
          stmt.run({
            id: m.id,
            cat: m.cat,
            title: m.title,
            desc: m.desc,
            time: m.time,
            icon: m.icon,
            level: m.level,
            content: m.content,
            quiz: m.quiz,
            created_at: m.created_at,
            updated_at: m.updated_at
          });
        }
        console.log("[DB] SQLite seeding completed successfully!");
      }
    } catch (err) {
      console.error("[DB] SQLite seeding materials failed:", err);
    }
  }
  _initialized = true;
}

/**
 * Retrieves all educational materials sorted by creation date.
 * Automatically parses JSON fields (content, quiz) for client consumption.
 * @returns {Promise<Array<object>>} List of materials.
 */
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

/**
 * Retrieves a single educational material by ID.
 * Parses JSON content and quiz objects.
 * @param {string|number} id - The unique material identifier.
 * @returns {Promise<object|undefined>} The material data object, or undefined if not found.
 */
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

/**
 * Creates a new educational material entry.
 * Encodes complex fields (content, quiz) as JSON strings for database compatibility.
 * @param {object} data - The material properties.
 * @returns {Promise<{id: number|string}>} The created entry's auto-generated database ID.
 */
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

/**
 * Updates an existing educational material record by ID.
 * @param {string|number} id - The unique material identifier.
 * @param {object} data - Updated material properties.
 * @returns {Promise<number>} Number of rows updated (1 if successful, 0 otherwise).
 */
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

/**
 * Deletes an educational material record.
 * @param {string|number} id - The material identifier.
 * @returns {Promise<number>} Number of deleted rows.
 */
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

/**
 * Retrieves an admin record by their unique username.
 * @param {string} username - The administrative user's login name.
 * @returns {Promise<object|undefined>} The admin record if found, otherwise undefined.
 */
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

/**
 * Returns the total count of registered administrators.
 * Used for onboarding checks to see if an initial admin account needs to be created.
 * @returns {Promise<number>} Count of registered admins.
 */
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

/**
 * Registers a new administrator with pre-hashed passwords.
 * @param {string} username - The login username.
 * @param {string} passwordHash - The secure pre-hashed password.
 * @returns {Promise<number|string>} The new administrator's database ID.
 */
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

/**
 * Retrieves all contact messages submitted via the public contact form, sorted chronologically.
 * @returns {Promise<Array<object>>} List of user contact messages.
 */
export async function getAllMessages() {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    return res.rows;
  } else {
    const db = await getSqliteDb();
    return db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  }
}

/**
 * Saves a public contact form submission into the database.
 * @param {object} data - Form submission values.
 * @param {string} data.name - Submitter name.
 * @param {string} data.email - Submitter email address.
 * @param {string} [data.phone] - Submitter phone number (optional).
 * @param {string} data.message - Form body text.
 * @returns {Promise<{id: number|string}>} Auto-generated submission ID.
 */
export async function createMessage(data) {
  await initSchema();
  const { name, email, phone, message } = data;
  if (isCloudDB) {
    const res = await _pool.query(`
      INSERT INTO messages (name, email, phone, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [name, email, phone || '', message]);
    return { id: res.rows[0].id };
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(`
      INSERT INTO messages (name, email, phone, message)
      VALUES (@name, @email, @phone, @message)
    `);
    const info = stmt.run({ name, email, phone: phone || '', message });
    return { id: info.lastInsertRowid };
  }
}

/**
 * Deletes a submitted contact message by ID.
 * @param {string|number} id - The message identifier.
 * @returns {Promise<number>} Number of deleted records.
 */
export async function deleteMessage(id) {
  await initSchema();
  if (isCloudDB) {
    const res = await _pool.query("DELETE FROM messages WHERE id = $1", [Number(id)]);
    return res.rowCount;
  } else {
    const db = await getSqliteDb();
    const info = db.prepare("DELETE FROM messages WHERE id = ?").run(Number(id));
    return info.changes;
  }
}
