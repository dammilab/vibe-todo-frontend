// TodoItem 컴포넌트: 개별 할일 항목을 표시하며,
// 완료 토글, 수정, 삭제 기능을 제공합니다.

import { useState } from "react";

function TodoItem({ todo, onUpdate, onDelete }) {
  // 수정 모드 상태 및 수정 중인 내용
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);

  // 완료 토글: 체크 아이콘 클릭 시 완료/미완료 상태를 전환합니다.
  const handleToggle = () => {
    onUpdate(todo._id, { isCompleted: !todo.isCompleted });
  };

  // 수정 저장: 빈 값이 아닐 경우 서버에 수정 내용을 반영합니다.
  const handleSave = () => {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    onUpdate(todo._id, { content: trimmed });
    setIsEditing(false);
  };

  // 수정 취소: 원래 내용으로 복원하고 수정 모드를 종료합니다.
  const handleCancel = () => {
    setEditContent(todo.content);
    setIsEditing(false);
  };

  // 키보드 단축키: Enter → 저장, Escape → 취소
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <li className={`goal-item ${todo.isCompleted ? "completed" : ""}`}>
      {/* 완료 토글 버튼 (체크 아이콘) */}
      <button className="icon-btn check-btn" onClick={handleToggle} title="완료 토글">
        {todo.isCompleted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
        )}
      </button>

      {/* 수정 모드: 인라인 편집 입력창 + 저장/취소 버튼 */}
      {isEditing ? (
        <div className="edit-group">
          <input
            type="text"
            className="notebook-edit-input"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {/* 저장 버튼 (체크 아이콘) */}
          <button className="icon-btn save-btn" onClick={handleSave} title="저장">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          {/* 취소 버튼 (X 아이콘) */}
          <button className="icon-btn cancel-btn" onClick={handleCancel} title="취소">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ) : (
        <>
          {/* 할일 내용: 더블클릭으로 수정 모드 진입 */}
          <span className="item-content" onDoubleClick={() => setIsEditing(true)}>
            {todo.content}
          </span>
          {/* 액션 버튼 그룹: hover 시 표시 */}
          <div className="item-actions">
            {/* 수정 버튼 (연필 아이콘) */}
            <button className="icon-btn edit-btn" onClick={() => setIsEditing(true)} title="수정">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            {/* 삭제 버튼 (휴지통 아이콘) */}
            <button className="icon-btn delete-btn" onClick={() => onDelete(todo._id)} title="삭제">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
