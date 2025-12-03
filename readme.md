# Todo List Backend (Express)

Next.js 프론트엔드와 연동되는 Todo REST API 서버입니다. 날짜(`target_date`) 기반 필터링, 완료/제목 수정, 삭제를 지원합니다.

## 빠른 시작 (Windows PowerShell)

```powershell
cd C:\Users\Yuna\Desktop\Todo_List\back
npm install
npm run dev
```

- 서버: http://localhost:4000
- 헬스체크: http://localhost:4000/todos

## 환경 변수(.env)

```env
PORT=4000
# 쉼표로 여러 오리진 지정
CORS_ORIGINS=http://localhost:3000,https://todo-list-front-end-mrvs.vercel.app

# 선택: DB 연결 문자열 (사용 중인 DB에 맞게)
# DATABASE_URL=postgres://user:pass@host:5432/dbname
```

## CORS 설정

- 파일: `src/app.js`
- 오리진은 `.env` 또는 하드코딩으로 설정합니다.

```js
const cors = require("cors");
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "http://localhost:3000").split(","),
    credentials: true,
  })
);
```

## 데이터 모델

```json
{
  "id": "18",
  "title": "할 일 제목",
  "description": "선택 사항",
  "completed": false,
  "target_date": "2025-12-03",
  "createdAt": "2025-12-03T01:23:45.000Z",
  "updatedAt": "2025-12-03T01:23:45.000Z"
}
```

- target_date는 응답 시 `YYYY-MM-DD` 형식을 권장합니다.

## API 엔드포인트

- GET /todos
  - 응답: Todo 배열
- POST /todos
  - 요청 바디: `{ "title": string, "target_date": "YYYY-MM-DD", "description"?: string }`
  - 응답: 생성된 Todo(201)
- PATCH /todos/:id
  - 요청 바디: `{ "title"?: string, "completed"?: boolean, "target_date"?: "YYYY-MM-DD", "description"?: string }`
  - 응답: 수정된 Todo(200)
- DELETE /todos/:id
  - 응답: 204(No Content) 또는 404/500

### 예시(curl)

```bash
# 리스트
curl http://localhost:4000/todos

# 생성
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"새 할 일","target_date":"2025-12-03"}'

# 완료 토글
curl -X PATCH http://localhost:4000/todos/18 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 삭제
curl -X DELETE http://localhost:4000/todos/18
```

## 오류 처리

- 400 Bad Request: 필드 누락/형식 오류
- 404 Not Found: 존재하지 않는 id
- 500 Internal Server Error: DB 오류 등
  - 프론트는 삭제 500 발생 시 “이미 삭제된 글입니다” 알림 후 새로고침을 수행합니다.

## 프로젝트 구조

```text
back/
├─ src/
│  ├─ app.js                # Express, CORS, 미들웨어
│  ├─ routes/
│  │  └─ todos.routes.js    # /todos 라우팅
│  ├─ controllers/
│  │  └─ todos.controller.js# 요청/응답 처리
│  ├─ services/
│  │  └─ todos.service.js   # 비즈니스 로직, 날짜 포맷 정규화
│  └─ repositories/         # DB 접근(선택 구성)
├─ package.json
├─ README.md
└─ .env                     # 환경변수
```

## 개발 노트

- target_date는 서비스 레이어에서 `YYYY-MM-DD`로 정규화하여 응답하면 프론트 필터링과 일치합니다.
- 순서 저장이 필요하면 `order` 필드를 추가하고 `PATCH /todos/reorder` 엔드포인트로 일괄 업데이트를 권장합니다.

## 라이선스

내부 사용 프로젝트(임의).
