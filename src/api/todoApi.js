// 백엔드 API 통신 모듈: 할일 데이터를 서버와 주고받습니다.
// 배포 환경: Vercel Rewrite(/api)를 통해 프록시하여 CORS를 우회합니다.
// 로컬 환경: localhost:5000으로 직접 요청합니다.
const BASE_URL = import.meta.env.PROD
  ? "/api/todos"
  : "http://localhost:5000/todos";

// 공통 fetch 래퍼: 서버 응답을 파싱하고, 실패 시 최대 2회 재시도합니다.
// Heroku 무료 플랜은 슬립 후 첫 요청이 실패할 수 있어 재시도가 필요합니다.
async function request(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`서버 오류 (${res.status})`);
      }

      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

// 할일 전체 조회: GET /todos — 서버에서 전체 할일 목록을 가져옵니다.
export async function fetchTodos() {
  return request(BASE_URL);
}

// 할일 생성: POST /todos — 새로운 할일을 서버에 저장합니다.
export async function createTodo(content) {
  return request(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

// 할일 수정: PATCH /todos/:id — 내용 또는 완료 상태를 수정합니다.
export async function updateTodo(id, updates) {
  return request(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

// 할일 삭제: DELETE /todos/:id — 특정 할일을 서버에서 삭제합니다.
export async function deleteTodo(id) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
