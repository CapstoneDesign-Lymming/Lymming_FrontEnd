import "./UserModal.scss";

const Usermodal = () => {
  return (
    <div className="Usermodal">
      <div className="back">
        <button>뒤로</button>
      </div>
      <div className="top">
        <img />
        <span className="top-name">박준서</span>
        <span className="top-introduce">안녕하세요 박준서입니다</span>
      </div>
      <div className="center">
        <div className="center-job">
          <span>프론트</span>
          <span>대학생</span>
        </div>
        <div className="center-feature">
          <span>밤</span>
          <span>계획</span>
          <span>조용</span>
          <span>온라인</span>
        </div>
        <div className="center-skills">
          <span>밤</span> <span>밤</span> <span>밤</span> <span>밤</span>
        </div>
      </div>

      <div className="bottom">
        <button>채팅하기</button>
      </div>
    </div>
  );
};

export default Usermodal;
