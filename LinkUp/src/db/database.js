import initSqlJs from 'sql.js';

let db = null;
let SQL = null;

// Initialize database
export async function initDatabase() {
  if (db) return db;

  try {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });

    // Check if there is a saved database in localStorage
    const savedDb = localStorage.getItem('linkup_db');
    
    if (savedDb) {
      const buffer = Uint8Array.from(atob(savedDb), c => c.charCodeAt(0));
      db = new SQL.Database(buffer);
    } else {
      // Create new database
      db = new SQL.Database();
      createTables();
      seedDatabase();
    }

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Create tables
function createTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT,
      email TEXT,
      status TEXT DEFAULT 'offline',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chats table
  db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      last_message TEXT,
      timestamp TEXT,
      unread INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    )
  `);

  // Current user table
  db.run(`
    CREATE TABLE IF NOT EXISTS current_user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT,
      email TEXT
    )
  `);

  saveDatabase();
}

// Seed initial data
function seedDatabase() {
  // Current user
  db.run(`
    INSERT INTO current_user (id, name, avatar, email)
    VALUES ('me', 'Макс', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max', 'max@linkup.com')
  `);

  // Users
  const users = [
    ['Анастасія', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia', 'online'],
    ['Олександр', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'offline'],
    ['Джейн Сміт', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', 'online'],
    ['Богдан', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bogdan', 'idle']
  ];

  users.forEach(([name, avatar, status]) => {
    db.run(`
      INSERT INTO users (name, avatar, status)
      VALUES (?, ?, ?)
    `, [name, avatar, status]);
  });

  // Chats
  db.run(`
    INSERT INTO chats (user_id, last_message, timestamp, unread)
    VALUES (1, 'Круто, дякую за стрім!', '10:42', 2)
  `);

  db.run(`
    INSERT INTO chats (user_id, last_message, timestamp, unread)
    VALUES (2, 'Коли наступний випуск?', 'Вчора', 0)
  `);

  db.run(`
    INSERT INTO chats (user_id, last_message, timestamp, unread)
    VALUES (3, 'Надіслано фото', 'Вчора', 0)
  `);

  // Messages for chat 1
  const messages1 = [
    [1, 1, 'Привіт! Як твій проект?', '10:30'],
    [1, 'me', 'Привіт! Все супер, вже майже закінчив.', '10:32'],
    [1, 1, 'Ого, ти швидкий! Покажеш результат?', '10:35'],
    [1, 'me', 'Звісно, ось посилання.', '10:36'],
    [1, 1, 'Круто, дякую за стрім!', '10:42']
  ];

  messages1.forEach(([chatId, senderId, text, time]) => {
    db.run(`
      INSERT INTO messages (chat_id, sender_id, text, time)
      VALUES (?, ?, ?, ?)
    `, [chatId, senderId, text, time]);
  });

  // Messages for chat 2
  const messages2 = [
    [2, 'me', 'Ти бачив оновлення Next.js?', '14:20'],
    [2, 2, 'Так, Server Actions це щось!', '15:00'],
    [2, 2, 'Коли наступний випуск?', '15:05']
  ];

  messages2.forEach(([chatId, senderId, text, time]) => {
    db.run(`
      INSERT INTO messages (chat_id, sender_id, text, time)
      VALUES (?, ?, ?, ?)
    `, [chatId, senderId, text, time]);
  });

  // Messages for chat 3
  db.run(`
    INSERT INTO messages (chat_id, sender_id, text, time)
    VALUES (3, 3, 'Привіт, це Джейн.', '09:00')
  `);

  saveDatabase();
}

// Save database to localStorage
export function saveDatabase() {
  if (!db) return;
  
  try {
    const data = db.export();
    const buffer = Array.from(data);
    const base64 = btoa(String.fromCharCode(...buffer));
    localStorage.setItem('linkup_db', base64);
  } catch (error) {
    console.error('Database save error:', error);
  }
}

// Get current user
export function getCurrentUser() {
  if (!db) return null;
  
  const stmt = db.prepare('SELECT * FROM current_user LIMIT 1');
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  
  const row = stmt.getAsObject();
  stmt.free();
  
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    email: row.email
  };
}

// Get all users
export function getAllUsers() {
  if (!db) return [];
  
  const stmt = db.prepare('SELECT * FROM users ORDER BY name');
  const users = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    users.push({
      id: row.id,
      name: row.name,
      avatar: row.avatar,
      email: row.email,
      status: row.status
    });
  }
  
  stmt.free();
  return users;
}

// Get all chats
export function getAllChats() {
  if (!db) return [];
  
  const stmt = db.prepare(`
    SELECT c.*, u.name as user_name, u.avatar, u.status
    FROM chats c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.timestamp DESC
  `);
  
  const chats = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    chats.push({
      id: row.id,
      userId: row.user_id,
      lastMessage: row.last_message,
      timestamp: row.timestamp,
      unread: row.unread,
      userName: row.user_name,
      userAvatar: row.avatar,
      userStatus: row.status
    });
  }
  
  stmt.free();
  return chats;
}

// Get messages for a chat
export function getChatMessages(chatId) {
  if (!db) return [];
  
  const stmt = db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC');
  stmt.bind([chatId]);
  const messages = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    messages.push({
      id: row.id,
      chatId: row.chat_id,
      senderId: row.sender_id,
      text: row.text,
      time: row.time
    });
  }
  
  stmt.free();
  return messages;
}

// Add new message
export function addMessage(chatId, senderId, text, time) {
  if (!db) return null;
  
  db.run(`
    INSERT INTO messages (chat_id, sender_id, text, time)
    VALUES (?, ?, ?, ?)
    `, [chatId, senderId, text, time]);

  // Update last message in chat
  db.run(`
    UPDATE chats 
    SET last_message = ?, timestamp = ?
    WHERE id = ?
  `, [text, time, chatId]);
  
  saveDatabase();
  
  return {
    id: db.exec('SELECT last_insert_rowid()')[0].values[0][0],
    chatId,
    senderId,
    text,
    time
  };
}

// Update unread message count
export function updateUnreadCount(chatId, count) {
  if (!db) return;
  
  db.run(`
    UPDATE chats 
    SET unread = ?
    WHERE id = ?
  `, [count, chatId]);
  
  saveDatabase();
}

// Get chat by ID
export function getChatById(chatId) {
  if (!db) return null;
  
  const stmt = db.prepare(`
    SELECT c.*, u.name as user_name, u.avatar, u.status
    FROM chats c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `);
  
  stmt.bind([chatId]);
  
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  
  const row = stmt.getAsObject();
  stmt.free();
  
  return {
    id: row.id,
    userId: row.user_id,
    lastMessage: row.last_message,
    timestamp: row.timestamp,
    unread: row.unread,
    userName: row.user_name,
    userAvatar: row.avatar,
    userStatus: row.status
  };
}

// Get user by ID
export function getUserById(userId) {
  if (!db) return null;
  
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([userId]);
  
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  
  const row = stmt.getAsObject();
  stmt.free();
  
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    email: row.email,
    status: row.status
  };
}

// Check if chat exists with user
export function chatExists(userId) {
  if (!db) return false;
  
  const stmt = db.prepare('SELECT id FROM chats WHERE user_id = ?');
  stmt.bind([userId]);
  const exists = stmt.step();
  stmt.free();
  
  return exists;
}

// Create new chat
export function createChat(userId) {
  if (!db) return null;
  
  // Check if chat already exists
  if (chatExists(userId)) {
    const stmt = db.prepare('SELECT id FROM chats WHERE user_id = ?');
    stmt.bind([userId]);
    stmt.step();
    const chatId = stmt.getAsObject().id;
    stmt.free();
    return getChatById(chatId);
  }
  
  db.run(`
    INSERT INTO chats (user_id, last_message, timestamp, unread)
    VALUES (?, '', 'Зараз', 0)
  `, [userId]);
  
  saveDatabase();
  
  const stmt = db.prepare('SELECT last_insert_rowid()');
  stmt.step();
  const chatId = stmt.get()[0];
  stmt.free();
  
  return getChatById(chatId);
}

// Delete chat (remove from friends)
export function deleteChat(userId) {
  if (!db) return false;
  
  // Delete all messages from this chat
  const stmt = db.prepare('SELECT id FROM chats WHERE user_id = ?');
  stmt.bind([userId]);
  
  if (stmt.step()) {
    const chatId = stmt.getAsObject().id;
    stmt.free();
    
    // Delete messages
    db.run('DELETE FROM messages WHERE chat_id = ?', [chatId]);
    
    // Delete chat
    db.run('DELETE FROM chats WHERE id = ?', [chatId]);
    
    saveDatabase();
    return true;
  }
  
  stmt.free();
  return false;
}

// Register new user
export function registerUser(name, email, avatar = null) {
  if (!db) return null;
  
  // Generate avatar if not provided
  if (!avatar) {
    avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  }
  
  // Update current user
  db.run(`
    DELETE FROM current_user
  `);
  
  db.run(`
    INSERT INTO current_user (id, name, avatar, email)
    VALUES ('me', ?, ?, ?)
  `, [name, avatar, email]);
  
  saveDatabase();
  
  return getCurrentUser();
}
