const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'livechat.db');

let db = null;

async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#4CAF50',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    assigned_admin_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender_type TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed default admin
  const result = db.exec('SELECT COUNT(*) FROM admins');
  const adminCount = result.length > 0 ? result[0].values[0][0] : 0;
  if (adminCount === 0) {
    const adminPass = process.env.ADMIN_PASSWORD || 'Phikha123';
    const hashedPassword = bcrypt.hashSync(adminPass, 10);
    db.run('INSERT INTO admins (username, password, display_name, avatar_color) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'Admin Support', '#4CAF50']);
    console.log('Default admin created - username: admin');
  }

  save();
  return db;
}

function save() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Helper: run query and return rows as objects
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

function runSql(sql, params = []) {
  db.run(sql, params);
  save();
}

// === Exported functions ===
function createConversation(id, visitorName, visitorEmail) {
  runSql('INSERT INTO conversations (id, visitor_name, visitor_email) VALUES (?, ?, ?)', [id, visitorName, visitorEmail]);
}

function getConversation(id) {
  return queryOne('SELECT * FROM conversations WHERE id = ?', [id]);
}

function getAllConversations() {
  return queryAll(`SELECT c.*,
    (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
    (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
    (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_type = 'visitor') as visitor_msg_count
   FROM conversations c ORDER BY c.updated_at DESC`);
}

function updateConversationStatus(id, status) {
  runSql("UPDATE conversations SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
}

function updateConversationTimestamp(id) {
  runSql("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?", [id]);
}

function insertMessage(conversationId, senderType, senderName, content) {
  runSql('INSERT INTO messages (conversation_id, sender_type, sender_name, content) VALUES (?, ?, ?, ?)',
    [conversationId, senderType, senderName, content]);
}

function getMessages(conversationId) {
  return queryAll('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC', [conversationId]);
}

function getAdminByUsername(username) {
  return queryOne('SELECT * FROM admins WHERE username = ?', [username]);
}

function getAdminById(id) {
  return queryOne('SELECT id, username, display_name, avatar_color FROM admins WHERE id = ?', [id]);
}

module.exports = {
  initDatabase,
  createConversation,
  getConversation,
  getAllConversations,
  updateConversationStatus,
  updateConversationTimestamp,
  insertMessage,
  getMessages,
  getAdminByUsername,
  getAdminById,
};
