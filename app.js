const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const realtimeDb = require('./realtime-database');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

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

// 용인시청소년미래재단 프로그램 정보 스크래핑 API
app.get('/api/programs', async (req, res) => {
    try {
        console.log('프로그램 정보 스크래핑 시작...');
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // 용인시청소년미래재단 홈페이지 접속
        await page.goto('https://www.yiyf.or.kr', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // 페이지 내용 가져오기
        const content = await page.content();
        const $ = cheerio.load(content);
        
        const programs = [];
        
        // 프로그램 정보 추출 (실제 사이트 구조에 맞게 수정 필요)
        $('.program-item, .news-item, .board-item').each((index, element) => {
            if (index >= 8) return false; // 최대 8개까지만
            
            const $el = $(element);
            const title = $el.find('h3, h4, .title, .subject').first().text().trim();
            const link = $el.find('a').first().attr('href');
            const image = $el.find('img').first().attr('src');
            
            if (title) {
                programs.push({
                    title: title,
                    image: image ? (image.startsWith('http') ? image : `https://www.yiyf.or.kr${image}`) : 'default-program.jpg',
                    applicationPeriod: '상시 접수',
                    participationPeriod: '문의 필요',
                    link: link ? (link.startsWith('http') ? link : `https://www.yiyf.or.kr${link}`) : 'https://www.yiyf.or.kr'
                });
            }
        });
        
        await browser.close();
        
        // 만약 스크래핑이 실패하면 기본 데이터 반환
        if (programs.length === 0) {
            programs.push(
                {
                    title: "수지청소년문화의집 '수지맞은 베이킹교실 4차' 활동",
                    image: "program1.jpg",
                    applicationPeriod: "2025-07-23 ~ 2025-08-01",
                    participationPeriod: "2025-08-02 ~ 2025-08-30",
                    link: "https://www.yiyf.or.kr"
                },
                {
                    title: "수지청소년문화의집 '수지맞은 베이킹교실 3차' 활동",
                    image: "program2.jpg",
                    applicationPeriod: "2025-06-19 ~ 2025-07-04",
                    participationPeriod: "2025-07-05 ~ 2025-07-26",
                    link: "https://www.yiyf.or.kr"
                },
                {
                    title: "유림청소년문화의집 청소년이 배우는 역사의 진실 '청.사.진' 활동공유",
                    image: "program3.jpg",
                    applicationPeriod: "2025-08-30 ~ 2025-09-13",
                    participationPeriod: "2025-08-30 ~ 2025-09-13",
                    link: "https://www.yiyf.or.kr"
                }
            );
        }
        
        console.log(`프로그램 ${programs.length}개 스크래핑 완료`);
        res.json(programs);
        
    } catch (error) {
        console.error('프로그램 스크래핑 오류:', error);
        
        // 오류 시 기본 데이터 반환
        const defaultPrograms = [
            {
                title: "수지청소년문화의집 '수지맞은 베이킹교실 4차' 활동",
                image: "program1.jpg",
                applicationPeriod: "2025-07-23 ~ 2025-08-01",
                participationPeriod: "2025-08-02 ~ 2025-08-30",
                link: "https://www.yiyf.or.kr"
            },
            {
                title: "수지청소년문화의집 '수지맞은 베이킹교실 3차' 활동",
                image: "program2.jpg",
                applicationPeriod: "2025-06-19 ~ 2025-07-04",
                participationPeriod: "2025-07-05 ~ 2025-07-26",
                link: "https://www.yiyf.or.kr"
            },
            {
                title: "유림청소년문화의집 청소년이 배우는 역사의 진실 '청.사.진' 활동공유",
                image: "program3.jpg",
                applicationPeriod: "2025-08-30 ~ 2025-09-13",
                participationPeriod: "2025-08-30 ~ 2025-09-13",
                link: "https://www.yiyf.or.kr"
            }
        ];
        
        res.json(defaultPrograms);
    }
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