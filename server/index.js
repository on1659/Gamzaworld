import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import passport from 'passport';
import { setupPassport } from './auth/passport.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Passport 설정
setupPassport();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://gamzaworld.up.railway.app'] 
      : ['http://localhost:5173'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/auth', authRoutes);

// API routes will go here
app.get('/api/rankings/:game', async (req, res) => {
  // TODO: DB query
  res.json({ rankings: [] });
});

// Socket.IO for real-time features
import { gameSessionManager } from './game/GameSessionManager.js';

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ===== 채팅 =====
  socket.on('chat:message', (data) => {
    io.emit('chat:message', {
      ...data,
      timestamp: Date.now()
    });
  });

  // ===== 게임 세션 =====
  
  // 게임 시작 (싱글 모드)
  socket.on('game:start', ({ gameId, mode = 'single', playerData }) => {
    try {
      // 세션 생성
      const session = gameSessionManager.createSession(gameId, mode);
      if (!session) {
        socket.emit('game:error', { message: `'${gameId}' 게임을 찾을 수 없습니다` });
        return;
      }

      // 플레이어 추가
      gameSessionManager.joinSession(session.sessionId, socket.id, playerData);
      
      // 게임 시작
      const state = gameSessionManager.startSession(session.sessionId);
      
      // 클라이언트에 세션 정보 전송
      socket.emit('game:started', state);
      
      // 게임 루프: 30fps로 게임 업데이트 후 상태 전송
      const stateInterval = setInterval(() => {
        const currentSession = gameSessionManager.getSession(session.sessionId);
        if (!currentSession || currentSession.state === 'finished') {
          clearInterval(stateInterval);
          return;
        }

        // 게임 한 프레임 업데이트
        const currentState = currentSession.update();
        if (!currentState) {
          clearInterval(stateInterval);
          return;
        }

        socket.emit('game:state', currentState);

        // 게임 오버 → 인터벌 정리
        if (currentSession.state === 'finished') {
          clearInterval(stateInterval);
        }
      }, 1000 / 30); // 30 FPS
      
    } catch (error) {
      socket.emit('game:error', { message: error.message });
    }
  });

  // 입력 처리
  socket.on('game:input', (input) => {
    try {
      const state = gameSessionManager.handleInput(socket.id, input);
      if (state) {
        socket.emit('game:state', state);
      }
    } catch (error) {
      socket.emit('game:error', { message: error.message });
    }
  });

  // 게임 종료
  socket.on('game:end', () => {
    const session = gameSessionManager.getPlayerSession(socket.id);
    if (session) {
      session.end();
      socket.emit('game:finished', session.getFinalResults());
    }
  });

  // 연결 해제 시 세션에서 제거
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameSessionManager.leaveSession(socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`🎮 Gamzaworld server running on port ${PORT}`);
});
