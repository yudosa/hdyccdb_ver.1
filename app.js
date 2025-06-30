const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const realtimeDb = require('./realtime-database');

// 예약 관련 라우트 가져오기
const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

// 파이어베이스 Realtime Database 초기화 함수
async function initializeFirebase() {
    try {
        console.log('Firebase Realtime Database 초기화 시작...');
        
        // 기본 시설 데이터 초기화
        await realtimeDb.initializeDefaultFacilities();
        
        console.log('Firebase Realtime Database 초기화 완료');
    } catch (error) {
        console.error('Firebase Realtime Database 초기화 실패:', error.message);
        throw error;
    }
}

// CORS 설정 강화 - 클라우드타입 배포 환경 고려
const corsOptions = {
    origin: function (origin, callback) {
        // 개발 환경에서는 모든 origin 허용
        if (!origin || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // 프로덕션 환경에서는 클라우드타입 도메인과 특정 도메인만 허용
        const allowedOrigins = [
            'https://*.cloudtype.app',
            'https://*.cloudtype.io',
            'https://your-domain.vercel.app',
            'https://your-domain.netlify.app',
            'https://your-domain.com'
        ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const pattern = allowedOrigin.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowedOrigin === origin;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('CORS 정책에 의해 차단되었습니다.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// 미들웨어 설정
app.use(cors(corsOptions)); // CORS 설정 적용
app.use(bodyParser.json()); // JSON 데이터 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 정적 파일 제공 (HTML, CSS, JS 파일들)
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
app.use('/api/reservations', reservationRoutes);

// 기본 라우트 - 예약 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 데이터베이스 초기화 후 서버 시작
initializeFirebase()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`서버가 포트 ${PORT}에서 실행 중입니다!`);
            console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
            console.log(`http://localhost:${PORT} 에서 확인하세요.`);
        });
    })
    .catch((err) => {
        console.error('서버 시작 실패:', err);
        process.exit(1);
    }); 