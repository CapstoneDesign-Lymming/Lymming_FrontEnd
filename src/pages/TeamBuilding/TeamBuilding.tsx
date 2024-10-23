import Header from "../../components/header/Header";
import "./TeamBuilding.scss";

const TeamBuilding = () => {
  return (
    <div className="TeamBuilding">
      <Header />

      <div className="content">
        <h2 className="content-title_h2">프로젝트 정보를 입력해주세요</h2>
        <div className="content-top">
          <div className="content-top-left">
            <span className="content-top-left-title">모집 구분</span>
            <div className="content-top-left-body">
              <input type="radio" />
              <input type="radio" />
            </div>
          </div>
          <div className="content-top-right">
            <div className="content-top-right-1">
              <span>모집 인원</span>
              <input type="text" />
            </div>
            <div className="content-top-right-2">
              <span>진행 방식</span>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className="content-center">
          <div className="content-center-left">
            <span>프로젝트 기간</span>
            <input />
          </div>
          <div className="content-center-right">
            <span>모집 마감일</span>
            <input />
          </div>
        </div>
        <div className="content-center">
          <div className="content-center-left">
            <span>모집 포지션</span>
            <input />
          </div>
          <div className="content-center-right">
            <span>원하는 개발 스타일</span>
            <input />
          </div>
        </div>
        <div className="input_title">
          <span>제목</span>
          <input type="text" placeholder="제목을 입력해 주세요" />
        </div>

        <div className="input_img">
          <span>이미지 첨부</span>
          <input type="image" />
        </div>

        <div className="input_content">
          <span>내용</span>
          <textarea />
        </div>

        <div className="btn_wrapper">
          <button>등록</button>
          <button>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilding;
