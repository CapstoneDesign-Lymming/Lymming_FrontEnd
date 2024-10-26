import Header from "../../components/header/Header";
import "./Participate.scss";
import dummy from "../../data/participateDummyData.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Usermodal from "../../components/Modal/UserModal/UserModal";

const Participate = () => {
  const navigate = useNavigate();
  const [userModalOpen, setUserModalOpen] = useState(false);

  //서버에서 리스트 받아오는 걸로 수정해야함

  return (
    <div className="Participate">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal close={setUserModalOpen} />
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
                onClick={() =>
                  navigate(`/participate/detail/${index}`, { state: it })
                }
              >
                <div className="content-item-top-label">
                  <div className="content-item-top-label-left">{it.type}</div>
                  <div className="content-item-top-label-right">
                    <img />
                    <span>D-20</span>
                  </div>
                </div>
                <div className="content-item-top-title">{it.title}</div>
                <div className="content-item-top-info">
                  <span>마감</span> <span>|</span> <span>{it.end}</span>
                </div>
                <div className="content-item-top-feature">
                  {it.position.map((it, index) => {
                    return <span key={index}>{it}</span>;
                  })}
                </div>
                <div className="content-item-top-style">
                  {it.style.map((it, index) => {
                    return <span key={index}>{it}</span>;
                  })}
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
                  <span>{it.name}</span>
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
