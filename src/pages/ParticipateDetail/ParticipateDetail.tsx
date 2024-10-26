import { useState } from "react";
import Header from "../../components/header/Header";
import "./ParticipateDetail.scss";
import Usermodal from "../../components/Modal/UserModal/UserModal";

const ParticipateDetail = () => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  return (
    <div className="ParticipateDetail">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal close={setUserModalOpen} />
        </>
      )}

      <div className="content">
        <div className="content-name">
          <img />
          <span className="bold_name" onClick={() => setUserModalOpen(true)}>
            박준서
          </span>
          <span>2024.09.11</span>
        </div>
        <div className="content-title">
          프로젝트를 쉽게 구하는 플랫폼 리밍의 팀원을 모집합니다
        </div>
        <div className="content-info">
          <div className="content-info-top">
            <span className="bold_span">마감날짜</span>
            <span>2024.09.11</span>
          </div>
          <div className="content-info-center">
            <div className="content-info-center-left">
              <span className="bold_span_center">모집하는 분야</span>
              <span>프론트</span>
              <span>디자이너</span>
            </div>
            <div className="content-info-center-right">
              <span className="bold_span_center">원하는 작업유형</span>
              <span>프론트</span>
              <span>디자이너</span>
            </div>
          </div>
          <div className="content-info-bottom">
            <span className="bold_span">원하는 기술 스택</span>
            <span>프론트</span>
            <span>디자이너</span>
          </div>
        </div>
        <hr />
        <div className="content-text">
          본문입니다. 본문입니다. 본문입니다. 본문입니다. 본문입니다.
          본문입니다. 본문입니다. 본문입니다. 본문입니다. 본문입니다.
          본문입니다. 본문입니다. 본문입니다. 본문입니다. 본문입니다.
          본문입니다. 본문입니다. 본문입니다. 본문입니다. 본문입니다.
        </div>
      </div>
      <button className="bottom_btn">채팅하기</button>
    </div>
  );
};

export default ParticipateDetail;
