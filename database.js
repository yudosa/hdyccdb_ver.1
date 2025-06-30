const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 데이터베이스 파일 경로 - 클라우드타입 배포 환경 고려
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database', 'reservations.db');

// 데이터베이스 디렉토리 확인 및 생성
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    try {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('데이터베이스 디렉토리가 생성되었습니다:', dbDir);
    } catch (err) {
        console.error('데이터베이스 디렉토리 생성 실패:', err.message);
    }
}

console.log('데이터베이스 경로 설정:', dbPath);
console.log('데이터베이스 디렉토리:', dbDir);

// 데이터베이스 연결 - 클라우드타입 환경에서 안정성을 위해 설정 추가
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
        console.error('데이터베이스 경로:', dbPath);
        // 연결 실패 시에도 서버는 계속 실행
        return;
    } else {
        console.log('SQLite 데이터베이스에 연결되었습니다.');
        console.log('데이터베이스 경로:', dbPath);
        
        // 데이터베이스 설정 최적화
        db.run('PRAGMA journal_mode = WAL;');
        db.run('PRAGMA synchronous = NORMAL;');
        db.run('PRAGMA cache_size = 10000;');
        db.run('PRAGMA temp_store = MEMORY;');
        
        createTables();
    }
});

// 테이블 생성 함수
function createTables() {
    // 예약 테이블 생성
    const createReservationsTable = `
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            facility TEXT NOT NULL,
            detail TEXT DEFAULT '-',
            date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            purpose TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 시설 정보 테이블 생성
    const createFacilitiesTable = `
        CREATE TABLE IF NOT EXISTS facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            max_capacity INTEGER,
            hourly_rate INTEGER DEFAULT 0
        )
    `;

    db.run(createReservationsTable, (err) => {
        if (err) {
            console.error('예약 테이블 생성 오류:', err.message);
        } else {
            console.log('예약 테이블이 생성되었습니다.');
        }
    });

    db.run(createFacilitiesTable, (err) => {
        if (err) {
            console.error('시설 테이블 생성 오류:', err.message);
        } else {
            console.log('시설 테이블이 생성되었습니다.');
            insertDefaultFacilities(); // 기본 시설 데이터 삽입
        }
    });
}

// 기본 시설 데이터 삽입
function insertDefaultFacilities() {
    const facilities = [
        {
            name: '플레이스테이션',
            description: '게임 및 엔터테인먼트 공간',
            max_capacity: 4,
            hourly_rate: 5000
        },
        {
            name: '보드게임',
            description: '보드게임 및 카드게임 공간',
            max_capacity: 8,
            hourly_rate: 3000
        },
        {
            name: '강의실',
            description: '교육 및 세미나 공간',
            max_capacity: 30,
            hourly_rate: 10000
        },
        {
            name: '체육관',
            description: '스포츠 및 운동 공간',
            max_capacity: 50,
            hourly_rate: 15000
        },
        {
            name: '음악실',
            description: '음악 연습 및 공연 공간',
            max_capacity: 20,
            hourly_rate: 8000
        },
        {
            name: '도서관',
            description: '독서 및 학습 공간',
            max_capacity: 40,
            hourly_rate: 3000
        }
    ];

    // 기존 데이터 확인
    db.get('SELECT COUNT(*) as count FROM facilities', (err, row) => {
        if (err) {
            console.error('시설 데이터 확인 오류:', err.message);
            return;
        }

        // 데이터가 없으면 삽입
        if (row.count === 0) {
            const insertQuery = 'INSERT INTO facilities (name, description, max_capacity, hourly_rate) VALUES (?, ?, ?, ?)';
            
            facilities.forEach(facility => {
                db.run(insertQuery, [facility.name, facility.description, facility.max_capacity, facility.hourly_rate], (err) => {
                    if (err) {
                        console.error(`${facility.name} 삽입 오류:`, err.message);
                    } else {
                        console.log(`${facility.name} 시설이 추가되었습니다.`);
                    }
                });
            });
        } else {
            console.log('시설 데이터가 이미 존재합니다.');
        }
    });
}

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['*'];

module.exports = db; 