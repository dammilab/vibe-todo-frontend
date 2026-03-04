// 백엔드 API 통신 모듈: 할일 데이터를 서버와 주고받습니다.
// 배포 환경: Vercel Rewrite(/api)를 통해 프록시하여 CORS를 우회합니다.
// 로컬 환경: localhost:5000으로 직접 요청합니다.
const BASE_URL = import.meta.env.PROD
  ? "/api/todos"
  : "http://localhost:5000/todos";

// 할일 전체 조회: GET /todos — 서버에서 전체 할일 목록을 가져옵니다.
export async function fetchTodos() {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// 할일 생성: POST /todos — 새로운 할일을 서버에 저장합니다.
export async function createTodo(content) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// 할일 수정: PATCH /todos/:id — 내용 또는 완료 상태를 수정합니다.
export async function updateTodo(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// 할일 삭제: DELETE /todos/:id — 특정 할일을 서버에서 삭제합니다.
export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}
