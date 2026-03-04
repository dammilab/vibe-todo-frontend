// TodoForm 컴포넌트: 새로운 할일을 입력하고 추가하는 폼입니다.

import { useState } from "react";

function TodoForm({ onAdd }) {
  // 입력 필드 상태 관리
  const [content, setContent] = useState("");

  // 폼 제출 핸들러: 빈 값 방지 후 부모에게 추가 요청을 전달합니다.
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setContent("");
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      {/* 할일 입력 필드 */}
      <input
        type="text"
        className="notebook-input"
        placeholder="할일을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {/* 추가 버튼 (+ 아이콘) */}
      <button type="submit" className="icon-btn add-btn" title="추가">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </form>
  );
}

export default TodoForm;
