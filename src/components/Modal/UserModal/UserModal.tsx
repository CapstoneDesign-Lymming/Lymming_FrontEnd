import "./UserModal.scss";
import back from "../../../assets/img/leftrrow.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UsermodalProps {
  close: (value: boolean) => void;
  userId: String;
}

const Usermodal: React.FC<UsermodalProps> = ({ close, userId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  // 유저 아이디로 유저 디테일 서버에서 불러오는 코드 추가하기
  const getUserData = async () => {
    const res = await axios.get("", {
      params: { userId },
    });
    setUserData(userData);
    console.log(res);
  };

  return (
    <div className="Usermodal">
      <div className="back">
        <button onClick={() => close(false)}>
          <img src={back} />
        </button>
      </div>
      <div className="top">
        <img />
        <span className="top-name">박준서</span>
        <span className="top-introduce">안녕하세요 박준서입니다</span>
      </div>
      <div className="center">
        <div className="center-job">
          <span>프론트</span>
          <span>대학생</span>
        </div>
        <div className="center-feature">
          <span>밤</span>
          <span>계획</span>
          <span>조용</span>
          <span>온라인</span>
        </div>
        <div className="center-skills">
          <span>밤</span> <span>밤</span> <span>밤</span> <span>밤</span>
        </div>
      </div>

      {/* 유저아이디로 채팅방 접근하기 */}
      <div className="bottom">
        <button onClick={() => navigate("/chat", { state: { userId } })}>
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default Usermodal;
