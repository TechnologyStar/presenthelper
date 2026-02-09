import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { sanitizeMessage, filterSensitiveWords, checkMessageFrequency } from '../utils/security.js';

const clients = new Map(); // userId -> ws connection
const rooms = new Map(); // roomId -> Set of userIds

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({
    server,
    path: '/ws/chat'
  });

  wss.on('connection', async (ws, req) => {
    let userId = null;
    let username = null;

    // 认证
    try {
      const token = new URL(req.url, 'http://localhost').searchParams.get('token');
      if (!token) {
        ws.close(1008, 'No token provided');
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      username = decoded.username;

      // 存储连接
      clients.set(userId, ws);

      // 发送欢迎消息
      ws.send(JSON.stringify({
        type: 'system',
        message: '欢迎来到红色聊天室！',
        timestamp: new Date().toISOString()
      }));

      // 广播用户上线
      broadcast({
        type: 'user_join',
        userId,
        username,
        timestamp: new Date().toISOString()
      }, userId);

    } catch (error) {
      console.error('WebSocket auth error:', error);
      ws.close(1008, 'Invalid token');
      return;
    }

    // 处理消息
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        // 频率限制
        if (!checkMessageFrequency(userId, 10, 60000)) {
          ws.send(JSON.stringify({
            type: 'error',
            message: '发送消息过于频繁，请稍后再试'
          }));
          return;
        }

        switch (message.type) {
          case 'chat':
            handleChatMessage(userId, username, message.content);
            break;

          case 'join_room':
            handleJoinRoom(userId, message.roomId);
            break;

          case 'leave_room':
            handleLeaveRoom(userId, message.roomId);
            break;

          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: '未知的消息类型'
            }));
        }
      } catch (error) {
        console.error('Message handling error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: '消息处理失败'
        }));
      }
    });

    // 处理断开连接
    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);

        // 从所有房间移除
        for (const [roomId, members] of rooms.entries()) {
          if (members.has(userId)) {
            members.delete(userId);
            if (members.size === 0) {
              rooms.delete(roomId);
            }
          }
        }

        // 广播用户离线
        broadcast({
          type: 'user_leave',
          userId,
          username,
          timestamp: new Date().toISOString()
        });
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // 处理聊天消息
  function handleChatMessage(userId, username, content) {
    // 安全过滤
    let cleanContent = sanitizeMessage(content);
    cleanContent = filterSensitiveWords(cleanContent);

    if (!cleanContent || cleanContent.length === 0) {
      const ws = clients.get(userId);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'error',
          message: '消息内容不合法'
        }));
      }
      return;
    }

    // 广播消息
    broadcast({
      type: 'chat',
      userId,
      username,
      content: cleanContent,
      timestamp: new Date().toISOString()
    });
  }

  // 加入房间
  function handleJoinRoom(userId, roomId) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userId);

    const ws = clients.get(userId);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'room_joined',
        roomId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // 离开房间
  function handleLeaveRoom(userId, roomId) {
    const room = rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        rooms.delete(roomId);
      }
    }

    const ws = clients.get(userId);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'room_left',
        roomId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // 广播消息
  function broadcast(message, excludeUserId = null) {
    const messageStr = JSON.stringify(message);

    for (const [userId, ws] of clients.entries()) {
      if (userId !== excludeUserId && ws.readyState === ws.OPEN) {
        ws.send(messageStr);
      }
    }
  }

  // 获取在线用户数
  function getOnlineCount() {
    return clients.size;
  }

  return {
    wss,
    getOnlineCount,
    broadcast
  };
};

export default setupWebSocket;
