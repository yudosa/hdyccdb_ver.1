# 흥덕청소년 문화의집 시설 이용 예약 시스템

## 개요
흥덕청소년 문화의집의 시설 이용 예약을 관리하는 웹 애플리케이션입니다. 
Firebase Realtime Database를 사용하여 실시간 데이터 동기화와 안정적인 데이터 저장을 제공합니다.
모바일, 태블릿, 데스크톱 모든 디바이스에서 최적화된 사용자 경험을 제공합니다.

## 🚀 주요 기능
- ✅ 시설 예약 생성 및 관리
- ✅ 예약 현황 실시간 조회
- ✅ 예약 취소 기능
- ✅ 시설별 상세 정보 제공
- ✅ Firebase Realtime Database 연동
- ✅ 실시간 데이터 동기화
- ✅ 반응형 웹 디자인

## 🛠️ 기술 스택

### 백엔드
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **Firebase Realtime Database**: 실시간 데이터베이스
- **Firebase SDK**: Firebase 서비스 연동
- **CORS**: 크로스 오리진 요청 처리

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링 및 애니메이션
- **JavaScript (ES6+)**: 동적 인터페이스 및 API 통신
- **Firebase Web SDK**: 클라이언트 사이드 Firebase 연동

### 개발 도구
- **Nodemon**: 개발 시 자동 재시작
- **Body-parser**: 요청 데이터 파싱

## 📦 설치 및 실행

### 필수 요구사항
- Node.js (v18 이상)
- npm 또는 yarn
- Firebase 프로젝트 설정

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd firebasedb
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정
Firebase 프로젝트에서 다음 서비스를 활성화하세요:
- **Realtime Database**: 실시간 데이터 저장
- **Authentication**: 사용자 인증 (선택사항)
- **Analytics**: 사용자 분석 (선택사항)

### 4. 데이터베이스 초기화
```bash
# Firebase Realtime Database 초기화
npm run init-realtime

# 또는 기존 SQLite 초기화 (선택사항)
npm run init-db
```

### 5. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

### 6. 접속
브라우저에서 `http://localhost:3000`으로 접속

## 🔥 Firebase 설정

### Firebase 프로젝트 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Realtime Database 활성화
3. 보안 규칙 설정 (개발용):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 환경 변수 설정
프로덕션 환경에서는 다음 환경 변수를 설정하세요:
```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app/
```

## 🏗️ 프로젝트 구조

```
firebasedb/
├── app.js                    # Express 서버 메인 파일
├── firebase-config.js        # Firebase 설정 (백엔드)
├── realtime-database.js      # Firebase Realtime Database 모듈
├── firebase-database.js      # Firestore 모듈 (대안)
├── init-realtime-db.js       # Realtime Database 초기화
├── init-firebase.js          # Firestore 초기화
├── package.json              # 프로젝트 의존성 및 스크립트
├── routes/
│   └── reservations.js       # 예약 관련 API 라우트
├── public/                   # 프론트엔드 파일들
│   ├── firebase-config.js    # Firebase 설정 (프론트엔드)
│   ├── index.html            # 메인 페이지
│   ├── rental.html           # 시설 이용 페이지
│   ├── select-facility.html  # 시설 선택 페이지
│   ├── reservation-date.html # 날짜 및 시간 선택 페이지
│   ├── reservation-complete.html # 예약 완료 페이지
│   ├── cancel-reservation.html # 예약 취소 페이지
│   ├── status.html           # 예약 현황 페이지
│   ├── admin.html            # 관리자 페이지
│   ├── styles.css            # 스타일시트
│   └── script.js             # 공통 JavaScript
└── README.md                 # 프로젝트 문서
```

## 📊 데이터베이스 구조

### Firebase Realtime Database 구조
```json
{
  "reservations": {
    "reservation_id_1": {
      "name": "홍길동",
      "phone": "010-1234-5678",
      "facility": "닌텐도",
      "detail": "닌텐도1",
      "date": "2024-01-15",
      "start_time": "14:00",
      "end_time": "16:00",
      "purpose": "게임",
      "created_at": "2024-01-15T14:00:00Z"
    }
  },
  "facilities": {
    "facility_id_1": {
      "name": "플레이스테이션",
      "description": "게임 및 엔터테인먼트 공간",
      "max_capacity": 4,
      "hourly_rate": 5000
    }
  }
}
```

## 🔌 API 문서

### 예약 관련 API

#### 1. 모든 예약 조회
```http
GET /api/reservations
```

#### 2. 특정 날짜 예약 조회
```http
GET /api/reservations/date/:date
```

#### 3. 새 예약 생성
```http
POST /api/reservations
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "facility": "닌텐도",
  "detail": "닌텐도1",
  "date": "2024-01-15",
  "start_time": "14:00",
  "end_time": "16:00",
  "purpose": "게임"
}
```

#### 4. 예약 수정
```http
PUT /api/reservations/:id
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "facility": "플레이스테이션",
  "date": "2024-01-16",
  "start_time": "15:00",
  "end_time": "17:00",
  "purpose": "게임"
}
```

#### 5. 예약 삭제
```http
DELETE /api/reservations/:id
```

#### 6. 시설 목록 조회
```http
GET /api/reservations/facilities
```

#### 7. 기간별 예약 조회
```http
GET /api/reservations/range?start=2024-01-01&end=2024-01-31
```

## 🎨 프론트엔드 기능

### 동적 시설 선택 시스템
- **시설 선택**: 메인 시설 선택 시 세부 옵션 자동 업데이트
- **층별 구성**: 각 시설의 층별 위치 정보 표시
- **실시간 검증**: 선택된 시설에 따른 유효성 검사

### 스마트 달력 시스템
- **실제 월별 달력**: 현재 월의 실제 날짜 표시
- **월 네비게이션**: 이전/다음 월 이동 기능
- **과거 날짜 비활성화**: 오늘 이전 날짜 자동 비활성화
- **시각적 피드백**: 선택된 날짜 하이라이트

### 지능형 시간 선택
- **오전/오후 탭**: AM/PM 구분으로 시간대별 선택
- **1시간 단위 슬롯**: 09:00-19:00 시간대
- **과거 시간 비활성화**: 현재 시간 이전 슬롯 자동 비활성화
- **예약된 시간 비활성화**: 이미 예약된 시간 자동 비활성화
- **실시간 업데이트**: 날짜 변경 시 시간 슬롯 자동 업데이트

### 예약 완료 시스템
- **모던 카드 디자인**: 깔끔한 예약 확인 카드
- **사용자 정보 표시**: 예약자 이름, 연락처
- **예약 상세 정보**: 시설, 날짜, 시간, 목적
- **예약 번호**: 고유 예약 식별자

### 예약 취소 시스템
- **이름/전화번호 검색**: 간편한 예약 조회
- **예약 목록 표시**: 사용자의 모든 예약 표시
- **취소 확인 모달**: 예약 상세 정보와 함께 취소 확인

## 🏢 지원 시설 (층별 구성)
- **1층**: 댄스연습실 (단일 공간)
- **3층**: 
  - 닌텐도 (9개 개별 기기 - 닌텐도1~9)
  - 플레이스테이션 (2개 개별 기기 - PS1, PS2)
  - 노래방 (2개 개별 방 - 노래방1, 노래방2)
  - 보드게임 (2개 개별 공간 - 보드게임1, 보드게임2)

## 📱 반응형 디자인

### 모바일 최적화 (768px 이하)
- 단일 컬럼 레이아웃
- 터치 친화적 인터페이스
- 빠른 로딩 최적화

### 태블릿 최적화 (768px - 1024px)
- 레이아웃 안정성
- 한 페이지 표시
- 터치 최적화
- 가독성 향상

### 데스크톱 지원 (1024px 이상)
- 다중 컬럼 레이아웃
- 마우스 인터랙션
- 고해상도 지원

## 🔒 보안 및 검증

### 입력 검증
- 필수 필드 검증
- 날짜/시간 형식 검증
- 과거 날짜/시간 예약 방지
- 시간 순서 검증 (시작 < 종료)

### 중복 예약 방지
- 동일 시설, 동일 시간대 중복 예약 자동 차단
- 세부 시설까지 고려한 정확한 중복 검사
- 실시간 예약 상태 확인

### Firebase 보안
- Realtime Database 보안 규칙 설정
- 인증된 사용자만 접근 가능 (선택사항)
- 데이터 무결성 보장

## 🚀 배포

### Cloudtype 배포 (권장)
1. Cloudtype 대시보드에서 새 프로젝트 생성
2. GitHub 저장소 연동
3. 자동 배포 설정 활성화
4. 환경 변수 설정:
   ```
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app/
   ```

### Vercel 배포
1. Vercel CLI 설치: `npm i -g vercel`
2. 프로젝트 배포: `vercel`
3. 환경 변수 설정 (Vercel 대시보드에서)

### Heroku 배포
1. Heroku CLI 설치
2. 앱 생성: `heroku create your-app-name`
3. 환경 변수 설정: `heroku config:set NODE_ENV=production`
4. 배포: `git push heroku main`

## 🐛 문제 해결

### Firebase 연결 오류
1. **Firebase 프로젝트 설정 확인**
   - 프로젝트 ID가 올바른지 확인
   - Realtime Database가 활성화되었는지 확인

2. **보안 규칙 확인**
   - 개발 중에는 읽기/쓰기 권한 허용
   - 프로덕션에서는 적절한 보안 규칙 설정

3. **네트워크 연결 확인**
   - 방화벽 설정 확인
   - 인터넷 연결 상태 확인

### 예약 생성이 안 되는 경우
1. **브라우저 개발자 도구 확인**
   - Network 탭에서 API 요청/응답 확인
   - Console 탭에서 에러 메시지 확인

2. **서버 로그 확인**
   - 배포 플랫폼의 로그 확인
   - 로컬에서는 터미널에서 로그 확인

### 일반적인 문제들
- **CORS 오류**: `allowedOrigins`에 도메인 추가
- **Firebase 권한 오류**: 보안 규칙 확인
- **네트워크 오류**: API 엔드포인트 URL 확인

## 📝 사용 예시

### 1. 시설 예약하기
1. 웹사이트 접속 (`http://localhost:3000`)
2. "시설 이용" 탭 클릭
3. 이용자 정보 입력 (이름, 나이, 성별, 전화번호)
4. 시설 선택 페이지에서 원하는 시설 선택
5. 날짜 선택 페이지에서:
   - 원하는 날짜 클릭 (과거 날짜는 비활성화됨)
   - 오전/오후 탭 선택
   - 원하는 시간 슬롯 선택 (예약된 시간은 비활성화됨)
6. 예약 완료 페이지에서 예약 정보 확인

### 2. 예약 취소하기
1. "예약 취소" 탭 클릭
2. 이름과 전화번호 입력
3. "예약 내역 조회" 버튼 클릭
4. 예약 목록에서 취소할 예약 선택
5. "취소하기" 버튼 클릭
6. 확인 모달에서 "확인" 클릭

### 3. 예약 현황 확인
1. "이용현황" 탭 클릭
2. 날짜별 예약 현황 확인
3. 시설별 사용 현황 파악

## 📞 지원 및 문의

프로젝트 관련 문의사항이나 버그 리포트는 이슈 트래커를 통해 제출해 주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**흥덕청소년 문화의집** - 청소년들의 문화 활동을 위한 최고의 공간 🏛️

PGHOST=your-supabase-host.supabase.co
PGUSER=your-db-username
PGPASSWORD=your-db-password
PGDATABASE=your-db-name 

const db = require('./database/database');
db.pool.connect()
  .then(() => console.log('PostgreSQL 연결 성공!'))
  .catch(err => {
    console.error('PostgreSQL 연결 실패:', err.message);
    process.exit(1);
  }); 

## ☁️ Cloudtype + GitHub 자동 배포 안내

### 자동 배포 동작 방식
- Cloudtype에 GitHub 저장소가 연동되어 있다면, main/master 브랜치에 코드를 push할 때마다 자동으로 배포가 진행됩니다.
- Cloudtype의 '자동 배포' 옵션이 켜져 있어야 하며, 배포 이력 및 로그에서 자동 반영 여부를 확인할 수 있습니다.

### 자동 배포 설정 방법
1. Cloudtype 대시보드에서 프로젝트 생성 시 GitHub 저장소를 연동합니다.
2. '자동 배포' 옵션을 활성화합니다.
3. main/master 브랜치에 push하면 자동으로 최신 코드가 배포됩니다.

### 수동 배포가 필요한 경우
- 자동 배포가 꺼져 있거나, 브랜치 설정이 다를 경우에는 Cloudtype 대시보드에서 직접 '배포' 버튼을 눌러야 변경사항이 반영됩니다.

### 참고
- Cloudtype 대시보드의 '배포 이력' 또는 '로그'에서 배포 상태를 확인할 수 있습니다.
- 자동 배포가 정상 동작하지 않을 경우, Cloudtype의 '자동 배포' 설정을 다시 확인하세요. 

## ✨ 주요 UI/UX 개선점

- **앱처럼 한 화면에 주요 정보가 보이도록 레이아웃과 여백을 최적화**
- **여백 최소화, 탭과 안내 카드가 한 화면에 딱 붙게, 불필요한 공백 완전 제거**
- **모든 주요 섹션(이용현황, 시설 안내, QR 안내 등) 간의 공백까지 완전히 제거하여 한 페이지처럼 자연스럽게 연결**
- **상단 이미지, 헤더, 본문(카드)의 가로폭을 모두 통일하여 일관된 레이아웃 제공**
- **안내 카드(시설 안내/QR 안내) 높이 균등하게 맞춤**
- **이용신청/예약취소/이용현황 탭 버튼의 가로 길이 증가로 터치 및 가독성 향상**
- **태블릿 세로에서는 안내 카드가 세로로, 가로/PC에서는 2열로, 모바일에서는 세로로 자연스럽게 배치되어 기기 방향에 따라 UX가 최적화됨**
- **기기별(PC/태블릿/모바일) 레이아웃 최적화 및 한 페이지 UX 실현**

## 📱 반응형 디자인 상세

- 태블릿/PC/모바일에서 한 페이지 UX 실현
- 모든 주요 섹션(탭, 안내 카드 등) 간의 간격까지 완전히 붙게 최적화
- 상단 이미지, 헤더, 본문(카드)의 가로폭을 모두 통일하여 깔끔한 한 페이지 UX 제공
- 태블릿 최적화 (768px - 1024px): 레이아웃 안정성, 한 페이지 표시, 터치 최적화, 가독성 향상
- 모바일 최적화 (768px 이하): 단일 컬럼, 터치 친화적, 빠른 로딩
- 데스크톱 지원 (1024px 이상): 다중 컬럼, 마우스 인터랙션, 고해상도 지원
- 안내 카드(시설 안내/QR 안내) 높이 균등, 탭 버튼 가로 길이 증가 등 최신 UX 반영

.facility-qr-row, .container, main {
    gap: 0 !important;
}
.facility-qr-row > *,
.tab-section > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
