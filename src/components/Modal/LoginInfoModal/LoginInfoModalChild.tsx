import "./LoginInfoModalChild.scss";

export const Child1 = () => {
  return (
    <div className="Child1">
      <div className="q1">
        <span>닉네임을 입력해 주세요</span>
        <input />
        <img />
      </div>

      <div className="q2">
        <span>성별을 선택해주세요</span>

        <div className="q2-box">
          <div className="q2-box-item">남성</div>
          <div className="q2-box-item">여성</div>
          <div className="q2-box-item">기타</div>
        </div>
      </div>

      <div className="q3">
        <span>직업을 선택해주세요</span>

        <div className="q3-box">
          <div className="q3-box-item">학생</div>
          <div className="q3-box-item">직장인</div>
          <div className="q3-box-item">기타</div>
        </div>
      </div>

      <div className="q4">
        <span>직종을 선택해주세요</span>

        <div className="q4-box">
          <div className="q4-box-item">개발</div>
          <div className="q4-box-item">기획</div>
          <div className="q4-box-item">디자인</div>
        </div>
      </div>
    </div>
  );
};
export const Child2 = () => {
  return (
    <div className="Child2">
      <div className="title">스킬 및 도구를 선택하세요</div>
      <div className="skills">
        <div className="skills-item">java</div>
      </div>
    </div>
  );
};

export const Child3 = () => {
  return (
    <div className="Child2">
      <div className="title">관심 있는 분야를 선택하세요</div>
      <div className="skills">
        <div className="skills-item">web</div>
      </div>
    </div>
  );
};
export const Child4 = () => {
  return (
    <div className="Child4">
      <div className="title">작업이 더 잘되는 시간은?</div>
      <div className="time">
        <div className="time-item">낮</div>
        <div className="time-item">밤</div>
      </div>
    </div>
  );
};

export const Child5 = () => {
  return (
    <div className="Child5">
      <div className="title">프로필을 설정해주세요</div>

      <div className="img">
        <img />
      </div>

      <div className="intro">
        <span>자신을 소개해주세요</span>
        <textarea />
      </div>
    </div>
  );
};

export const Child6 = () => {
  return (
    <div className="Child6">
      <img />
      <div className="title">회원가입 완료</div>

      <div className="intro">이제 리밍을 마음껏 이용해 보세요</div>
    </div>
  );
};
