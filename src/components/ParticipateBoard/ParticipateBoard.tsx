import { useNavigate } from "react-router-dom";
import newImg from "../../assets/img/new.png";
import watch from "../../assets/img/watch.png";
import chat from "../../assets/img/chat.png";
import heart from "../../assets/img/heart.png";
import "./ParticipateBoard.scss";
import { ParticipateItem } from "../../interfaces/participate";
import { useState } from "react";
import axios from "axios";
import { useInfoStore } from "../../store/useLoginStore";
import skills from "../../data/skills.json";

interface ParticipateBoardProps {
  item: ParticipateItem;
  index: number;
  setUserModalData: React.Dispatch<React.SetStateAction<string>>;
  setUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParticipateBoard: React.FC<ParticipateBoardProps> = ({
  item,

  setUserModalData,
  setUserModalOpen,
}) => {
  const navigate = useNavigate();
  const { data } = useInfoStore();
  const [isheartClic, setIsheartClic] = useState(false);

  const checkNewData = (upload: string) => {
    const nowTime = new Date();
    const uploadTime = new Date(upload);

    // 7일을 밀리초로 계산 (7일 * 24시간 * 60분 * 60초 * 1000밀리초)
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    // 현재 시간과 업로드 시간 차이 계산
    const timeDifference = nowTime.getTime() - uploadTime.getTime();

    // 업로드 시간이 7일 이내인지 확인
    const isNew = timeDifference <= sevenDaysInMillis;

    return isNew;
  };

  const remainingTime = (upload: string, end: string) => {
    const uploadTime = new Date(upload);
    const endTime = new Date(end);
    const remainTime = endTime.getTime() - uploadTime.getTime();
    if (remainTime > 0) {
      const days = Math.floor(remainTime / (1000 * 60 * 60 * 24)); // 남은 일수

      return `D-${days}`;
    } else {
      return "종료됨"; // 종료된 경우
    }
  };

  const onHeartClick = (user_id: number, project_id: number) => {
    if (isheartClic === true) {
      deleteHeart(user_id, project_id);
    } else {
      postHeart(user_id, project_id);
    }
    setIsheartClic(!isheartClic);
  };

  // 찜 누르기
  const postHeart = async (user_id: number, project_id: number) => {
    try {
      const res = await axios.post(
        `https://lymming-back.link/${user_id}/likes/${project_id}`
      );
      console.log("찜누르기 성공", res.data);
    } catch (e) {
      console.error("찜 누르기 실패", e);
    }
  };

  // 찜 취소
  const deleteHeart = async (user_id: number, project_id: number) => {
    try {
      const res = await axios.delete(
        `https://lymming-back.link/${user_id}/likes/${project_id}`
      );
      console.log("찜누르기 성공", res.data);
    } catch (e) {
      console.error("찜 누르기 실패", e);
    }
  };

  return (
    <div className="item">
      <div
        className="item-top"
        onClick={() => navigate(`/participate/detail/${item.projectId}`)}
      >
        <div className="item-top-label">
          <div className="item-top-label-left">{item.studyType}</div>
          <div className="item-top-label-right">
            <img
              src={newImg}
              style={{
                display: checkNewData(item.uploadTime) ? "inline" : "none",
              }}
            />
            <span>{remainingTime(item.uploadTime, item.deadline)}</span>
          </div>
        </div>
        <div className="item-top-title">{item.projectName}</div>
        <div className="item-top-info">
          <span>마감</span> <span>|</span> <span>{item.deadline}</span>
        </div>
        <div className="item-top-feature">
          {item.recruitmentField.split(",").map((it, index) => {
            return <span key={index}>{it}</span>;
          })}
        </div>

        <div className="item-top-style">
          {item.workType.split(",").map((it, index) => {
            return <span key={index}>{it}</span>;
          })}
        </div>

        <div className="item-top-skills">
          {item.techStack.split(",").map((it, index) => {
            const matchedSkill = skills.skills.find((s) => s.name === it);
            return <img src={matchedSkill?.url} key={index} />;
          })}
        </div>

        <hr />
      </div>
      <div className="item-bottom">
        <div
          className="item-bottom-left"
          onClick={() => {
            setUserModalData(item.nickname);

            setUserModalOpen(true);
          }}
        >
          <img />
          <span>{item.nickname}</span>
        </div>
        <div className="item-bottom-right">
          <div className="item-bottom-right-watch">
            <img src={watch} />
            <span>{item.viewCount}</span>
          </div>
          <div
            className="item-bottom-right-chat"
            onClick={() => navigate("/chat", { state: { id: item.nickname } })}
          >
            <img src={chat} />
            <span>채팅하기</span>
          </div>
          <div
            className="item-bottom-right-heart"
            onClick={() => onHeartClick(data.userId, item.projectId)}
          >
            <img
              className={`heart_img ${isheartClic ? "fill" : ""} `}
              src={heart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipateBoard;
