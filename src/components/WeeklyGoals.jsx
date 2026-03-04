// WeeklyGoals 컴포넌트: 주간 목표를 관리합니다.
// 데이터는 localStorage에 저장되어 브라우저를 닫아도 유지됩니다.

import { useState, useEffect } from "react";

// localStorage 키 이름
const STORAGE_KEY = "dami-weekly-goals";

// localStorage에서 주간 목표 목록을 불러옵니다.
function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 주간 목표 목록을 localStorage에 저장합니다.
function saveGoals(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function WeeklyGoals() {
  // 상태 관리: 목표 목록, 입력 값, 수정 대상 ID, 수정 중인 내용
  const [goals, setGoals] = useState(loadGoals);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // goals 상태가 변경될 때마다 localStorage에 자동 저장합니다.
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // 주간 목표 추가: 새 목표를 목록 맨 앞에 추가합니다.
  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const newGoal = {
      id: Date.now().toString(),
      content: trimmed,
      isCompleted: false,
    };
    setGoals((prev) => [newGoal, ...prev]);
    setInput("");
  };

  // 완료 토글: 목표의 완료/미완료 상태를 전환합니다.
  const handleToggle = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isCompleted: !g.isCompleted } : g))
    );
  };

  // 목표 삭제: 목록에서 해당 목표를 제거합니다.
  const handleDelete = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // 수정 모드 진입: 해당 목표의 내용을 편집 상태로 전환합니다.
  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditValue(goal.content);
  };

  // 수정 저장: 변경된 내용을 목표에 반영합니다.
  const handleSave = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, content: trimmed } : g))
    );
    setEditingId(null);
  };

  // 수정 취소: 편집 상태를 종료하고 원래 내용으로 돌아갑니다.
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // 키보드 단축키: Enter → 저장, Escape → 취소
  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") handleSave(id);
    if (e.key === "Escape") handleCancelEdit();
  };

  return (
    <section className="notebook-section weekly-section">
      {/* 섹션 제목 (달력 아이콘) */}
      <h2 className="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        주간 목표
      </h2>

      {/* 주간 목표 입력 폼 */}
      <form className="goal-form" onSubmit={handleAdd}>
        <input
          type="text"
          className="notebook-input"
          placeholder="이번 주 목표를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* 추가 버튼 (+ 아이콘) */}
        <button type="submit" className="icon-btn add-btn" title="추가">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </form>

      {/* 주간 목표 목록: 빈 상태 / 리스트 분기 렌더링 */}
      {goals.length === 0 ? (
        <p className="empty-message">등록된 주간 목표가 없습니다.</p>
      ) : (
        <ul className="goal-list">
          {goals.map((goal) => (
            <li key={goal.id} className={`goal-item ${goal.isCompleted ? "completed" : ""}`}>
              {/* 완료 토글 버튼 (체크 아이콘) */}
              <button className="icon-btn check-btn" onClick={() => handleToggle(goal.id)} title="완료 토글">
                {goal.isCompleted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
                )}
              </button>

              {/* 수정 모드: 인라인 편집 입력창 + 저장/취소 버튼 */}
              {editingId === goal.id ? (
                <div className="edit-group">
                  <input
                    type="text"
                    className="notebook-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, goal.id)}
                    autoFocus
                  />
                  {/* 저장 버튼 (체크 아이콘) */}
                  <button className="icon-btn save-btn" onClick={() => handleSave(goal.id)} title="저장">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  {/* 취소 버튼 (X 아이콘) */}
                  <button className="icon-btn cancel-btn" onClick={handleCancelEdit} title="취소">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ) : (
                <>
                  {/* 목표 내용: 더블클릭으로 수정 모드 진입 */}
                  <span className="item-content" onDoubleClick={() => startEdit(goal)}>
                    {goal.content}
                  </span>
                  {/* 액션 버튼 그룹: hover 시 표시 */}
                  <div className="item-actions">
                    {/* 수정 버튼 (연필 아이콘) */}
                    <button className="icon-btn edit-btn" onClick={() => startEdit(goal)} title="수정">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    {/* 삭제 버튼 (휴지통 아이콘) */}
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(goal.id)} title="삭제">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WeeklyGoals;
