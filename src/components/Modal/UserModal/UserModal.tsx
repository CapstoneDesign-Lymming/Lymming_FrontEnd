import "./UserModal.scss";
import back from "../../../assets/img/leftrrow.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "../../../interfaces/user";

interface UsermodalProps {
  close: (value: boolean) => void;
  nickname: String;
}

const Usermodal: React.FC<UsermodalProps> = ({ close, nickname }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserInfo>();

  useEffect(() => {
    getUserData();
  }, []);

  // 유저 아이디로 유저 디테일 서버에서 불러오는 코드 추가하기
  const getUserData = async () => {
    const res = await axios.get("https://lymming-back.link/user", {
      params: { nickname },
    });
    setUserData(res.data);
    console.log(res.data);
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
        <span className="top-name">{userData?.nickname}</span>
        <span className="top-introduce">{userData?.bio}</span>
      </div>
      <div className="center">
        <div className="center-job">
          <span>{userData?.job}</span>
        </div>
        <div className="center-feature">
          {userData?.devStyle.split(",").map((it) => {
            return <span>{it}</span>;
          })}
        </div>
        <div className="center-skills">
          {userData?.stack.split(",").map((it) => {
            return <span>{it}</span>;
          })}
        </div>
      </div>

      <div className="bottom">
        <button onClick={() => navigate("/chat", { state: { id: nickname } })}>
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default Usermodal;
