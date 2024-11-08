import { useNavigate } from "react-router-dom";
import newImg from "../../assets/img/new.png";
import watch from "../../assets/img/watch.png";
import chat from "../../assets/img/chat.png";
import heart from "../../assets/img/heart.png";
import "./ParticipateBoard.scss";
import { ParticipateItem } from "../../interfaces/participate";

interface ParticipateBoardProps {
  data: ParticipateItem;
  index: number;
  setUserModalData: React.Dispatch<React.SetStateAction<string>>;
  setUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParticipateBoard: React.FC<ParticipateBoardProps> = ({
  data,
  index,
  setUserModalData,
  setUserModalOpen,
}) => {
  const navigate = useNavigate();

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

  return (
    <div className="item">
      <div
        className="item-top"
        onClick={() =>
          navigate(`/participate/detail/${index}`, { state: data })
        }
      >
        <div className="item-top-label">
          <div className="item-top-label-left">{data.studyType}</div>
          <div className="item-top-label-right">
            <img
              src={newImg}
              style={{
                display: checkNewData(data.uploadTime) ? "inline" : "none",
              }}
            />
            <span>{remainingTime(data.uploadTime, data.deadline)}</span>
          </div>
        </div>
        <div className="item-top-title">{data.projectName}</div>
        <div className="item-top-info">
          <span>마감</span> <span>|</span> <span>{data.deadline}</span>
        </div>
        <div className="item-top-feature">
          {Array.isArray(data.recruitmentField) &&
          data.recruitmentField.length > 0 ? (
            data.recruitmentField.map((it, index) => {
              return <span key={index}>{it}</span>;
            })
          ) : (
            <span>{data.recruitmentField}</span>
          )}
        </div>

        <div className="item-top-style">
          {Array.isArray(data.workType) && data.workType.length > 0 ? (
            data.workType.map((it, index) => {
              return <span key={index}>{it}</span>;
            })
          ) : (
            <span>{data.workType}</span>
          )}
        </div>

        {/* 이미지로 수정하기 */}
        <div className="item-top-skills">
          {Array.isArray(data.skillicon) && data.skillicon.length > 0 ? (
            data.techStack.map((it, index) => {
              return <img src={it} key={index} />;
            })
          ) : (
            <span>{data.techStack}</span>
          )}
        </div>

        <hr />
      </div>
      <div className="item-bottom">
        <div
          className="item-bottom-left"
          onClick={() => {
            setUserModalData(data.userId);

            setUserModalOpen(true);
          }}
        >
          <img />
          <span>{data.userId}</span>
        </div>
        <div className="item-bottom-right">
          <div className="item-bottom-right-watch">
            <img src={watch} />
            <span>10</span>
          </div>
          <div
            className="item-bottom-right-chat"
            onClick={() => navigate("/chat", { state: { id: data.userId } })}
          >
            <img src={chat} />
            <span>채팅하기</span>
          </div>
          <div className="item-bottom-right-heart">
            <img src={heart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipateBoard;
