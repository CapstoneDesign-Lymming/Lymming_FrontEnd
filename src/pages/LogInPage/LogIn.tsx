import { useNavigate } from "react-router-dom";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import login_lottie from "../../assets/lottie/login_lottie.json";
import "./LogIn.scss";
import {
  // GoogleLoginButton,
  GithubLoginButton,
  createButton,
} from "react-social-login-buttons";

import LoginInfoModal from "../../components/Modal/LoginInfoModal/LoginInfoModal";
import {
  Child1,
  Child2,
  Child3,
  Child4,
  Child5,
  Child6,
  Child7,
  Child8,
  Child9,
} from "../../components/Modal/LoginInfoModal/LoginInfoModalChild";
import { useLoginStore } from "../../store/useLoginStore";
import logo from "../../assets/img/lymming_logo.png";
import left from "../../assets/img/leftrrow.png";
import login_mid from "../../assets/img/login_mid.png";
import { useRef } from "react";

const LogIn = () => {
  const REST_API_KEY: string = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI: string = import.meta.env.VITE_REDIRECT_URI;

  const GIT_REST_API_KEY: string = import.meta.env.VITE_GIT_REST_API_KEY;
  const GIT_REDIRECT_URI: string = import.meta.env.VITE_GIT_REDIRECT_URI;

  const navigate = useNavigate();
  const KakaoLoginButton = createButton({
    text: "카카오로 시작하기",
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
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const { count, isOpen } = useLoginStore();

  const kakaolink = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const gitlink = `https://github.com/login/oauth/authorize?client_id=${GIT_REST_API_KEY}&redirect_uri=${GIT_REDIRECT_URI}`;

  const onKakaoBtnClick = () => {
    window.location.href = kakaolink;
  };
  const onGitBtnClick = () => {
    window.location.href = gitlink;
  };

  // 로그인 페이지 렌더링 함수
  const renderLoginPage = () => {
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
      case 7:
        return <Child7 />;
      case 8:
        return <Child8 />;
      case 9:
        return <Child9 />;

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
        <button onClick={() => navigate("/")}>
          <img src={left} />
        </button>
      </div>

      <div className="content">
        <div className="left">
          <div>
            <div className="left-title">
              <img className="left-title-img" src={logo} />
              <span className="left-title-text"> lymming</span>
            </div>

            <h2>로그인</h2>

            <span>로그인 이후에 리밍을 즐겨보세요!</span>
          </div>
        </div>
        <div className="mid">
          <img src={login_mid} alt="" />
        </div>
        <div className="rightWrapper">
          <div className="right">
            <Lottie
              animationData={login_lottie}
              loop
              autoPlay
              lottieRef={lottieRef}
              className="login_lottie"
            />
            <KakaoLoginButton
              className="loginBtn"
              onClick={onKakaoBtnClick}
              style={{ width: "60%" }}
            />
            {/* <GoogleLoginButton text="구글 로그인" /> */}
            <GithubLoginButton
              className="loginBtn"
              text="깃허브로 시작하기"
              onClick={onGitBtnClick}
              style={{ width: "60%", marginTop: "5%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
