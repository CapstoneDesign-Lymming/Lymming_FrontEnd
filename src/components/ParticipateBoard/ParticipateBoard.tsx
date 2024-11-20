import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ParticipateBoard.scss";
import { useInfoStore } from "../../store/useLoginStore";
import { ParticipateItem } from "../../interfaces/participate";
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
    if (item.likes === true) {
      deleteHeart(user_id, project_id);
    } else {
      postHeart(user_id, project_id);
    }
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
            {/* <img
              src={newImg}
              style={{
                display: checkNewData(item.uploadTime) ? "inline" : "none",
              }}
            /> */}
            <div
              className="newIcon"
              style={{
                display: checkNewData(item.uploadTime) ? "inline" : "none",
              }}
            >
              <div>N</div>
            </div>
            <span
              className={`${
                remainingTime(item.uploadTime, item.deadline) === "종료됨"
                  ? "endProject"
                  : ""
              }`}
            >
              {remainingTime(item.uploadTime, item.deadline)}
            </span>
          </div>
        </div>
        <div className="item-top-title">{item.projectName}</div>
        <div
          className={`item-top-info ${
            remainingTime(item.uploadTime, item.deadline) === "종료됨"
              ? "endProject_text"
              : ""
          }`}
        >
          <span>마감</span> <span>|</span> <span>{item.deadline}</span>
        </div>
        <div className="item-top-feature_style">
          <div className="item-top-feature_style-feature">
            {item.recruitmentField.split(",").map((it, index) => {
              return <span key={index}>{it}</span>;
            })}
          </div>

          <div className="item-top-feature_style-style">
            {item.workType.split(",").map((it, index) => {
              return <span key={index}>{it}</span>;
            })}
          </div>
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
            {/* <img src={watch} /> */}
            <svg
              className="watch_icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
            </svg>
            <span>{item.viewCount}</span>
          </div>
          <div
            className="item-bottom-right-chat"
            onClick={() => navigate("/chat", { state: { id: item.nickname } })}
          >
            {/* <img src={chat} /> */}
            <svg
              className="chat_icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" />
            </svg>
            <span>채팅하기</span>
          </div>
          <div
            className="item-bottom-right-heart"
            onClick={() => onHeartClick(data.userId, item.projectId)}
          >
            <svg
              className={`heart_icon ${item.likes ? "fill" : ""} `}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipateBoard;
