import { useNavigate } from "react-router-dom";
import "./LogIn.scss";
import {
  GoogleLoginButton,
  GithubLoginButton,
  createButton,
} from "react-social-login-buttons";
import { useEffect, useRef, useState } from "react";
import LoginInfoModal from "../../components/Modal/LoginInfoModal/LoginInfoModal";
import {
  Child1,
  Child2,
  Child3,
  Child4,
  Child5,
  Child6,
} from "../../components/Modal/LoginInfoModal/LoginInfoModalChild";
import { useLoginStore } from "../../store/useLoginStore";

const LogIn = () => {
  const REST_API_KEY: string = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI: string = import.meta.env.VITE_REDIRECT_URI;

  const navigate = useNavigate();
  const KakaoLoginButton = createButton({
    text: "카카오 로그인",
    icon: () => (
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
        alt="Kakao"
        style={{ width: "24px", marginRight: "10px" }}
      />
    ),
    style: { background: "#FEE500", color: "#000" },
    activeStyle: { background: "#E5CC00" },
  });

  const { count, isOpen, setIsOpen } = useLoginStore();

  const kakaolink = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  // 여기는 깃허브 링크로 따로 추가해야함
  const gitlink = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const onKakaoBtnClick = () => {
    window.location.href = kakaolink;
  };
  const onGitBtnClick = () => {
    window.location.href = gitlink;
  };

  // 로그인 페이지 렌더링 함수
  const renderLoginPage = () => {
    console.log(count);

    switch (count) {
      case 1:
        return <Child1 />;
      case 2:
        return <Child2 />;
      case 3:
        return <Child3 />;
      case 4:
        return <Child4 />;
      case 5:
        return <Child5 />;
      case 6:
        return <Child6 />;
      default:
        return null; // 예외 처리
    }
  };

  return (
    <div className="LogIn">
      {isOpen && (
        <>
          <div className="backdrop" />
          <LoginInfoModal>{renderLoginPage()}</LoginInfoModal>
        </>
      )}
      <div className="back_wrapper">
        <button onClick={() => navigate("/")}>뒤로가기</button>
      </div>

      <div className="content">
        <div className="left">
          <div className="left-title">
            <img className="left-title-img" />
            <span className="left-title-text"> lymming</span>
          </div>

          <h2>로그인</h2>

          <span>리밍과 함께 하세요!</span>
        </div>

        <div className="right">
          <KakaoLoginButton onClick={onKakaoBtnClick} />
          <GoogleLoginButton text="구글 로그인" />
          <GithubLoginButton text="깃허브 로그인" onClick={onGitBtnClick} />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
