import Header from "../../components/header/Header";
import "./Participate.scss";
import dummy from "../../data/participateDummyData.json";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Usermodal from "../../components/Modal/UserModal/UserModal";

const Participate = () => {
  const navigate = useNavigate();
  const [userModalOpen, setUserModalOpen] = useState(true);

  return (
    <div className="Participate">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" />
          <Usermodal />
        </>
      )}

      <div className="menu">
        <div className="menu-tap">
          <span>전체</span>
          <span>프로젝트</span>
          <span>스터디</span>
        </div>
        <div className="menu-filter">
          <span>기술스택</span>
          <span>포지션</span>
          <span>진행방식</span>
        </div>
      </div>

      <div className="content">
        {dummy.dummy.map((it, index) => {
          return (
            <div className="content-item" key={index}>
              <div
                className="content-item-top"
                onClick={() => navigate(`/participate/detail/${index}`)}
              >
                <div className="content-item-top-label">
                  <div className="content-item-top-label-left">프로젝트</div>
                  <div className="content-item-top-label-right">
                    <img />
                    <span>D-20</span>
                  </div>
                </div>
                <div className="content-item-top-title">
                  프로젝트를 쉽게 구하는 플랫폼 리밍의 팀원을 모집합니다.
                </div>
                <div className="content-item-top-info">
                  <span>마감</span> <span>|</span> <span>2024.11.07</span>
                </div>
                <div className="content-item-top-feature">
                  <span>프론트</span> <span>백엔드</span> <span>디자이너</span>
                </div>
                <div className="content-item-top-skills">
                  <img />
                  <img />
                  <img />
                </div>
                <hr />
              </div>
              <div
                className="content-item-bottom"
                onClick={() => setUserModalOpen(true)}
              >
                <div className="content-item-bottom-left">
                  <img />
                  <span>프론트짱</span>
                </div>
                <div className="content-item-bottom-right">
                  <div className="content-item-bottom-right-watch">
                    <img />
                    <span>10</span>
                  </div>
                  <div className="content-item-bottom-right-chat">
                    <img />
                    <span>채팅하기</span>
                  </div>
                  <div className="content-item-bottom-right-heart">
                    <img />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Participate;
