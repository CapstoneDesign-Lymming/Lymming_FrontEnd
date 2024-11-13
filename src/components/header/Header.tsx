import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";
import { useInfoStore, useLoginStore } from "../../store/useLoginStore";
import headerImg from "../../assets/img/lymming_logo.png";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const { login } = useLoginStore();
  const [isMain, setIsMain] = useState(false);
  const [isHiddenBtnOn, setIsHiddenBtnOn] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [myPageOption, setMypageOption] = useState(false);
  const { data } = useInfoStore();

  // console.log(data.userImg);

  useEffect(() => {
    if (pageLocation.pathname == "/") setIsMain(true);
  }, [pageLocation]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      console.log("Current Scroll Y:", currentScrollY);
      // setHeaderVisible(currentScrollY > lastScrollY ? false:true);
      if (currentScrollY > lastScrollY) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`Header 
    ${isMain ? "MainHeader" : ""}
    ${headerVisible ? "" : "headerUp"}
    `}
    >
      <div className="Header-title">
        <img className="Header-title-img" src={headerImg} />
        <span className="Header-title-txt" onClick={() => navigate("/")}>
          lymming
        </span>
      </div>
      <ul
        className={`Header-ul
          ${login ? "Header-loginUl" : ""}`}
      >
        <li onClick={() => navigate("/participate")}>참여하기</li>
        <li onClick={() => navigate("/teambuild")}>팀 꾸리기</li>
        <li onClick={() => setIsHiddenBtnOn(!isHiddenBtnOn)}>둘러보기</li>
        {login && <li onClick={() => navigate("/share")}>내 프로젝트</li>}
        {/* <li
          className="chat"
          style={{ display: login === true ? "block" : "none" }}
          onClick={() => navigate("/chat", { state: { id: "" } })}
        >
          <img className="chat_img" src={headerChat} />
        </li> */}
        {/* <div>메시지</div> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="chat"
          style={{ display: login === true ? "block" : "none" }}
          onClick={() => navigate("/chat", { state: { id: "" } })}
        >
          <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
        </svg>

        {login == true ? (
          <li
            className="login_aft"
            onClick={() => setMypageOption(!myPageOption)}
          >
            <img src={data.userImg || undefined} />
            <span>{data.nickname}</span>
          </li>
        ) : (
          <li onClick={() => navigate("/login")}>로그인</li>
        )}
      </ul>
      <div className="Header-hidden">
        <div
          className={`hidden_btnBundle ${
            isHiddenBtnOn ? "HiddenBtnOn" : "HiddenBtnOff"
          } ${login ? "logined" : ""}
          `}
          onClick={() => setIsHiddenBtnOn(false)}
        >
          <div id="btn1" onClick={() => navigate("/member")}>
            참여자
          </div>
          <div id="btn2" onClick={() => navigate("/exhibition")}>
            전시회
          </div>
        </div>
      </div>

      <div
        className="Header-mypage_hidden"
        style={{ display: myPageOption ? "block" : "none" }}
      >
        <div className={`hidden_btn`} onClick={() => setIsHiddenBtnOn(false)}>
          <div id="btn1" onClick={() => navigate("/member")}>
            문의하기
          </div>
          <div id="btn2" onClick={() => navigate("/collect")}>
            글 모아보기
          </div>
          <div id="btn1" onClick={() => navigate("/member")}>
            마이페이지
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
