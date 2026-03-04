// App 컴포넌트: 메모장 형태의 메인 레이아웃을 구성하고,
// 주간 목표와 오늘의 할일 섹션을 통합 관리합니다.

import { useState, useEffect } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api/todoApi";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import WeeklyGoals from "./components/WeeklyGoals";
import "./App.css";

function App() {
  // 상태 관리: 할일 목록, 로딩 상태, 에러 메시지
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 할일 목록 조회: 서버에서 전체 할일을 불러옵니다.
  const loadTodos = async () => {
    try {
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 할일 목록을 최초 1회 로드합니다.
  useEffect(() => {
    loadTodos();
  }, []);

  // 할일 추가: 서버에 저장 후 목록 맨 앞에 추가합니다.
  const handleAdd = async (content) => {
    try {
      setError(null);
      const newTodo = await createTodo(content);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  // 할일 수정: 내용 또는 완료 상태를 서버에 반영합니다.
  const handleUpdate = async (id, updates) => {
    try {
      setError(null);
      const updated = await updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  // 할일 삭제: 서버에서 삭제 후 목록에서 제거합니다.
  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // 오늘 날짜를 한국어 형식으로 표시합니다.
  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    // 메모장 레이아웃: 스파인(바인딩) + 페이지
    <div className="notebook">
      <div className="notebook-spine" />
      <div className="notebook-page">
        {/* 헤더: 앱 제목 및 오늘 날짜 */}
        <header className="notebook-header">
          <h1 className="app-title">담이의 하루</h1>
          <p className="app-date">{dateStr}</p>
        </header>

        <div className="notebook-body">
          {/* 주간 목표 섹션 (localStorage 기반) */}
          <WeeklyGoals />

          {/* 오늘의 할일 섹션 (서버 API 기반) */}
          <section className="notebook-section todo-section">
            <h2 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              오늘의 할일
            </h2>

            {/* 할일 입력 폼 */}
            <TodoForm onAdd={handleAdd} />

            {/* 에러 메시지 표시 */}
            {error && <p className="error-message">{error}</p>}

            {/* 할일 목록: 로딩 / 빈 상태 / 리스트 분기 렌더링 */}
            {loading ? (
              <p className="loading-message">불러오는 중...</p>
            ) : todos.length === 0 ? (
              <p className="empty-message">등록된 할일이 없습니다.</p>
            ) : (
              <ul className="goal-list">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
