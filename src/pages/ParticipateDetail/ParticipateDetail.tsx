import { useState } from "react";
import Header from "../../components/header/Header";
import "./ParticipateDetail.scss";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import { useLocation, useNavigate } from "react-router-dom";

const ParticipateDetail = () => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {}; // 기본값 설정
  console.log(data);
  return (
    <div className="ParticipateDetail">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal close={setUserModalOpen} nickname={data.userId} />
        </>
      )}

      <div className="content">
        <div className="content-name">
          <img />
          <span className="bold_name" onClick={() => setUserModalOpen(true)}>
            {data.userId}
          </span>
          <span>{data.uploadTime}</span>
        </div>
        <div className="content-title">{data.title}</div>
        <div className="content-info">
          <div className="content-info-top">
            <span className="bold_span">마감날짜</span>
            <span>{data.end}</span>
          </div>
          <div className="content-info-center">
            <div className="content-info-center-left">
              <span className="bold_span_center">모집하는 분야</span>
              {data.recruitmentField
                .split(",")
                .map((it: string, index: number) => (
                  <span className="round_span" key={index}>
                    {it.trim()}
                  </span>
                ))}
            </div>
            <div className="content-info-center-right">
              <span className="bold_span_center">원하는 작업유형</span>
              {data.workType.split(",").map((it: string, index: number) => (
                <span className="round_span" key={index}>
                  {it.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="content-info-bottom">
            <span className="bold_span">원하는 기술 스택</span>
            {data.techStack.split(",").map((it: string, index: number) => (
              <img key={index} src={it.trim()} />
            ))}
          </div>
        </div>
        <hr />
        <div className="content-text">{data.description}</div>
      </div>
      <button
        className="bottom_btn"
        onClick={() => navigate("/chat", { state: { id: data.userId } })}
      >
        채팅하기
      </button>
    </div>
  );
};

export default ParticipateDetail;
