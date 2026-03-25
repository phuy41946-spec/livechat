const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const database = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' }
});

// Session setup
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Share session with Socket.IO
io.engine.use(sessionMiddleware);

// --- Auth middleware ---
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) return next();
  res.redirect('/admin/login');
}

// === HTTP Routes ===

// Chat widget page (customer facing)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// LiveChat-style URL
app.get('/licence/14863323/v2/open_chat.cgi', (req, res) => {
  // Serve the chat widget but inject a small script that auto-opens the chat
  try {
    const htmlPath = path.join(__dirname, 'public', 'chat.html');
    let content = fs.readFileSync(htmlPath, 'utf8');
    const injector = `\n<script>\n  // Auto-open pre-chat form when this URL is visited\n  window.addEventListener('DOMContentLoaded', () => {\n    try {\n      if (typeof showPrechat === 'function') {\n        // If the chat code defines showPrechat, call it\n        showPrechat();\n      } else {\n        // Otherwise set a flag that client-side code can detect and open prechat on load\n        localStorage.setItem('lc_auto_prechat', '1');\n      }\n    } catch(e) { /* silent */ }\n  });\n</script>\n`;
    // Insert injector before closing </body>, if present
    if (content.indexOf('</body>') !== -1) {
      content = content.replace(/<\/body>/i, injector + '</body>');
    } else {
      content += injector;
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (err) {
    console.error('Error serving auto-open chat page:', err);
    res.status(500).send('Server error');
  }
});

// Admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Admin login handler
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = database.getAdminByUsername(username);
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
  req.session.adminId = admin.id;
  req.session.adminName = admin.display_name;
  res.json({ success: true });
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Admin dashboard
app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Get all conversations
app.get('/api/conversations', requireAuth, (req, res) => {
  const conversations = database.getAllConversations();
  res.json(conversations);
});

// API: Get messages for a conversation
app.get('/api/conversations/:id/messages', requireAuth, (req, res) => {
  const messages = database.getMessages(req.params.id);
  res.json(messages);
});

// API: Close conversation
app.post('/api/conversations/:id/close', requireAuth, (req, res) => {
  database.updateConversationStatus(req.params.id, 'closed');
  io.to(req.params.id).emit('conversation_closed');
  io.to('admin_room').emit('conversation_updated');
  res.json({ success: true });
});

// API: Get admin info
app.get('/api/admin/me', requireAuth, (req, res) => {
  const admin = database.getAdminById(req.session.adminId);
  res.json(admin);
});

// === Socket.IO ===

// Track online visitors and admins
const onlineVisitors = new Map(); // conversationId -> socketId
const onlineAdmins = new Map();   // socketId -> adminInfo

// Visitor namespace
const chatbotScenario = require('./chatbot.js');

const visitorNsp = io.of('/visitor');
visitorNsp.on('connection', (socket) => {
  console.log('Visitor connected:', socket.id);

  // Start or resume chat
  socket.on('start_chat', (data) => {
    let conversationId = data.conversationId;

    if (conversationId) {
      // Resume existing conversation
      const existing = database.getConversation(conversationId);
      if (existing && existing.status === 'active') {
        socket.join(conversationId);
        onlineVisitors.set(conversationId, socket.id);
        const messages = database.getMessages(conversationId);
        socket.emit('chat_history', { conversationId, messages });
        adminNsp.to('admin_room').emit('visitor_online', { conversationId });
        return;
      }
    }

    // New conversation
    conversationId = uuidv4();
    const visitorName = data.name || 'Khách #' + Math.floor(Math.random() * 9000 + 1000);
    const visitorEmail = data.email || '';

    database.createConversation(conversationId, visitorName, visitorEmail);

    // Auto greeting (Chatbot start)
    const botStart = chatbotScenario["start"];
    const greetingMsg = botStart.message.replace('{name}', visitorName);

    // Send greeting as first message
    const greetingPayload = JSON.stringify({
      text: "HITCLUB Xin chào Quý Khách!",
      options: []
    });
    database.insertMessage(conversationId, 'bot', 'Hệ thống', greetingPayload);

    // Send main menu message
    const menuPayload = JSON.stringify({
      text: greetingMsg,
      options: botStart.options
    });
    database.insertMessage(conversationId, 'bot', 'Hệ thống', menuPayload);

    socket.join(conversationId);
    onlineVisitors.set(conversationId, socket.id);

    const messages = database.getMessages(conversationId);
    socket.emit('chat_history', { conversationId, messages });

    // Notify admins
    adminNsp.to('admin_room').emit('new_conversation', {
      conversationId,
      visitorName,
      visitorEmail,
    });
  });

  // Visitor sends message
  socket.on('send_message', (data) => {
    const { conversationId, content } = data;
    if (!conversationId || !content || content.trim().length === 0) return;

    const conversation = database.getConversation(conversationId);
    if (!conversation || conversation.status !== 'active') return;

    const sanitizedContent = content.trim().substring(0, 2000);

    database.insertMessage(conversationId, 'visitor', conversation.visitor_name, sanitizedContent);
    database.updateConversationTimestamp(conversationId);

    const msg = {
      conversation_id: conversationId,
      sender_type: 'visitor',
      sender_name: conversation.visitor_name,
      content: sanitizedContent,
      created_at: new Date().toISOString(),
    };

    // Send to admin room
    adminNsp.to('admin_room').emit('new_message', msg);
    // Echo back
    socket.emit('new_message', msg);

    // Bot Auto Reply handling
    if (data.botActionKey) {
      const nextStep = chatbotScenario[data.botActionKey];
      if (nextStep) {
        // Show typing indicator before bot replies
        socket.emit('bot_typing');

        // Support multi-message responses
        const allMessages = nextStep.messages || [nextStep.message];
        let delay = 1200;
        
        allMessages.forEach((msgText, idx) => {
          const isLast = idx === allMessages.length - 1;
          setTimeout(() => {
            const payload = JSON.stringify({
              text: msgText,
              options: isLast ? (nextStep.options || []) : []
            });
            database.insertMessage(conversationId, 'bot', 'Hệ thống', payload);
            database.updateConversationTimestamp(conversationId);
            
            const botMsg = {
              conversation_id: conversationId,
              sender_type: 'bot',
              sender_name: 'Hệ thống',
              content: payload,
              created_at: new Date().toISOString()
            };
            socket.emit('new_message', botMsg);
            adminNsp.to('admin_room').emit('new_message', botMsg);

            // Show typing again between multi-messages (except after last)
            if (!isLast) {
              socket.emit('bot_typing');
            }
          }, delay * (idx + 1));
        });
      }
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    adminNsp.to('admin_room').emit('visitor_typing', {
      conversationId: data.conversationId,
    });
  });

  socket.on('disconnect', () => {
    // Find and remove visitor
    for (const [convId, sockId] of onlineVisitors.entries()) {
      if (sockId === socket.id) {
        onlineVisitors.delete(convId);
        adminNsp.to('admin_room').emit('visitor_offline', { conversationId: convId });
        break;
      }
    }
  });
});

// Admin namespace
const adminNsp = io.of('/admin');
adminNsp.use((socket, next) => {
  const req = socket.request;
  if (req.session && req.session.adminId) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

adminNsp.on('connection', (socket) => {
  const adminId = socket.request.session.adminId;
  const adminName = socket.request.session.adminName;
  console.log('Admin connected:', adminName);

  socket.join('admin_room');
  onlineAdmins.set(socket.id, { adminId, adminName });

  // Send online visitors list
  socket.emit('online_visitors', Array.from(onlineVisitors.keys()));

  // Admin sends message
  socket.on('send_message', (data) => {
    const { conversationId, content } = data;
    if (!conversationId || !content || content.trim().length === 0) return;

    const conversation = database.getConversation(conversationId);
    if (!conversation) return;

    const sanitizedContent = content.trim().substring(0, 2000);

    database.insertMessage(conversationId, 'admin', adminName, sanitizedContent);
    database.updateConversationTimestamp(conversationId);

    const msg = {
      conversation_id: conversationId,
      sender_type: 'admin',
      sender_name: adminName,
      content: sanitizedContent,
      created_at: new Date().toISOString(),
    };

    // Send to visitor
    const visitorSocketId = onlineVisitors.get(conversationId);
    if (visitorSocketId) {
      visitorNsp.to(conversationId).emit('new_message', msg);
    }

    // Broadcast to all admins
    adminNsp.to('admin_room').emit('new_message', msg);
  });

  // Admin typing
  socket.on('typing', (data) => {
    const visitorSocketId = onlineVisitors.get(data.conversationId);
    if (visitorSocketId) {
      visitorNsp.to(data.conversationId).emit('admin_typing');
    }
  });

  socket.on('disconnect', () => {
    onlineAdmins.delete(socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

(async () => {
  await database.initDatabase();
  server.listen(PORT, () => {
    console.log(`Live Chat server running at http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    console.log(`Chat widget: http://localhost:${PORT}`);
  });
})();
