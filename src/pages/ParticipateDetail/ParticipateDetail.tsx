import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./ParticipateDetail.scss";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import { useNavigate, useParams } from "react-router-dom";
import { ParticipateItem } from "../../interfaces/participate";
import axios from "axios";
import skills from "../../data/skills.json";
import noUserImg from "../../assets/img/no-profile.webp";
import { useInfoStore } from "../../store/useLoginStore";
const ParticipateDetail = () => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [item, setItem] = useState<ParticipateItem>();
  const { data } = useInfoStore();

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
      setItem(res.data);
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
            nickname={item!.nickname}
            userId={item!.userId}
          />
        </>
      )}

      <div className="content">
        <div className="content-name">
          <img src={item?.userImg ? item?.userImg : noUserImg} />
          <span
            className="bold_name"
            onClick={() => {
              if (localStorage.getItem("token")) {
                setUserModalOpen(true);
              } else {
                window.alert("로그인 한 사용자만 접근 가능합니다!");
                navigate("/login");
              }
            }}
          >
            {item?.nickname}
          </span>
          <span>{item?.uploadTime}</span>
        </div>
        <div className="content-title">{item?.projectName}</div>
        <div className="content-info">
          <div className="content-info-top">
            <span className="bold_span">마감날짜</span>
            <span>{item?.deadline}</span>
          </div>
          <div className="content-info-center">
            <div className="content-info-center-left">
              <span className="bold_span_center">모집하는 분야</span>
              {item?.recruitmentField
                .split(",")
                .map((it: string, index: number) => (
                  <span className="round_span" key={index}>
                    {it.trim()}
                  </span>
                ))}
            </div>
            <div className="content-info-center-right">
              <span className="bold_span_center">원하는 작업유형</span>
              {item?.workType.split(",").map((it: string, index: number) => (
                <span className="round_span" key={index}>
                  {it.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="content-info-bottom">
            <span className="bold_span">원하는 기술 스택</span>
            {item?.techStack.split(",").map((it: string, index: number) => {
              const matchedSkill = skills.skills.find(
                (s) => s.name === it.trim()
              );
              return <img key={index} src={matchedSkill?.url} />;
            })}
          </div>
        </div>
        <hr />
        <img className="content-img" src={item?.projectImg} alt="" />

        <div className="content-text">{item?.description}</div>
      </div>
      <button
        className="bottom_btn"
        onClick={() => {
          if (localStorage.getItem("token")) {
            if (item?.nickname !== data.nickname) {
              navigate("/chat", {
                state: { id: item?.nickname, invite: false },
              });
            }
          } else {
            window.alert("로그인 한 사용자만 접근 가능합니다!");
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
