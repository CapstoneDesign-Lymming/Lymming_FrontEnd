import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./ParticipateDetail.scss";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import { useNavigate, useParams } from "react-router-dom";
import { ParticipateItem } from "../../interfaces/participate";
import axios from "axios";
import skills from "../../data/skills.json";
import noUserImg from "../../assets/img/no-profile.webp";
const ParticipateDetail = () => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [data, setData] = useState<ParticipateItem>();

  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  console.log(projectId);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get(
        `https://lymming-back.link/participate/detail/${projectId}`
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="ParticipateDetail">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal
            close={setUserModalOpen}
            nickname={data!.nickname}
            userId={data!.userId}
          />
        </>
      )}

      <div className="content">
        <div className="content-name">
          <img src={data?.userImg ? data?.userImg : noUserImg} />
          <span className="bold_name" onClick={() => setUserModalOpen(true)}>
            {data?.nickname}
          </span>
          <span>{data?.uploadTime}</span>
        </div>
        <div className="content-title">{data?.projectName}</div>
        <div className="content-info">
          <div className="content-info-top">
            <span className="bold_span">마감날짜</span>
            <span>{data?.deadline}</span>
          </div>
          <div className="content-info-center">
            <div className="content-info-center-left">
              <span className="bold_span_center">모집하는 분야</span>
              {data?.recruitmentField
                .split(",")
                .map((it: string, index: number) => (
                  <span className="round_span" key={index}>
                    {it.trim()}
                  </span>
                ))}
            </div>
            <div className="content-info-center-right">
              <span className="bold_span_center">원하는 작업유형</span>
              {data?.workType.split(",").map((it: string, index: number) => (
                <span className="round_span" key={index}>
                  {it.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="content-info-bottom">
            <span className="bold_span">원하는 기술 스택</span>
            {data?.techStack.split(",").map((it: string, index: number) => {
              const matchedSkill = skills.skills.find(
                (s) => s.name === it.trim()
              );
              return <img key={index} src={matchedSkill?.url} />;
            })}
          </div>
        </div>
        <hr />
        <div className="content-text">{data?.description}</div>
      </div>
      <button
        className="bottom_btn"
        onClick={() => {
          if (localStorage.getItem("token")) {
            navigate("/chat", { state: { id: data?.nickname, invite: false } });
          } else {
            navigate("/login");
          }
        }}
      >
        채팅하기
      </button>
    </div>
  );
};

export default ParticipateDetail;
