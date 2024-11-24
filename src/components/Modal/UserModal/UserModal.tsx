import "./UserModal.scss";
import back from "../../../assets/img/leftrrow.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import noUserImg from "../../../assets/img/no-profile.webp";

import skills from "../../../data/skills.json";
import { useInfoStore } from "../../../store/useLoginStore";

interface UsermodalProps {
  close: (value: boolean) => void;
  userId: number;
  nickname: string;
}

interface UserModal {
  userId: number;
  bio: string;
  devStyle: string[];
  favorites: number;
  gender: string;
  serverNickname: string;
  job: string;
  loginType: string;
  nickname: string;
  position: string;
  stack: string[];
  temperature: number;
  userImg: string | undefined;
  keyCode: string;
  uid: number | null;
  work_time: string;
  working_team: string;
  with_people: string;
  developerType: number;
}

const Usermodal: React.FC<UsermodalProps> = ({ close, userId, nickname }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserModal>();
  const { data } = useInfoStore();

  useEffect(() => {
    getUserData();
  }, []);

  // 유저 아이디로 유저 디테일 서버에서 불러오는 코드 추가하기
  const getUserData = async () => {
    const res = await axios.get(
      `https://lymming-back.link/member/list/${userId}`
    );
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
        <img src={userData?.userImg ? userData.userImg : noUserImg} />
        <span className="top-name">{userData?.nickname}</span>
        <span className="top-introduce">{userData?.bio}</span>
      </div>
      <div className="center">
        <div className="center-job">
          <span>{userData?.job}</span>
        </div>
        <div className="center-feature">
          {userData?.devStyle && // userData?.devStyle이 존재하는지 확인
            userData.devStyle[0]?.split(",").map((it, index) => (
              <span key={index}>{it.trim()}</span> // 요소 공백 제거 후 렌더링
            ))}
        </div>
        <div className="center-skills">
          {userData?.stack &&
            userData.stack[0]?.split(",").map((it, index) => {
              const matchedSkill = skills.skills.find((s) => {
                return s.name.toLowerCase() === it.toLowerCase(); // 조건을 반환
              });

              return <img src={matchedSkill?.url} key={index} alt="as" />;
            })}
        </div>
      </div>

      <div className="bottom">
        <button
          onClick={() => {
            console.log(
              "현재 사용자 ",
              data.nickname,
              "상대방",
              userData?.nickname
            );
            if (data.nickname !== userData?.nickname) {
              navigate("/chat", { state: { id: nickname, invite: false } });
            }
          }}
        >
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default Usermodal;
