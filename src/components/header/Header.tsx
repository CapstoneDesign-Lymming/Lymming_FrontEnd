import { useNavigate, useLocation} from "react-router-dom";
import "./Header.scss";
import { useLoginStore } from "../../store/useLoginStore";
import headerImg from "../../assets/img/lymming_logo.png";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const { login } = useLoginStore();
  const [isMain,setIsMain]=useState(false);
  const [isHiddenBtnOn,setIsHiddenBtnOn]=useState(false);
  const [headerVisible, setHeaderVisible]=useState(true);
  const [lastScrollY, setLastScrollY]=useState(0);

  useEffect(()=>{
    if(pageLocation.pathname=="/") setIsMain(true);
  },[pageLocation]);

 

  useEffect(()=>{
    const handleScroll=()=>{
      const currentScrollY = window.scrollY;
      console.log("Current Scroll Y:", currentScrollY);
      // setHeaderVisible(currentScrollY > lastScrollY ? false:true);
      if(currentScrollY>lastScrollY){
        setHeaderVisible(false);
      }else{
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
      window.addEventListener('scroll',handleScroll);
      return ()=> window.removeEventListener('scroll',handleScroll);
  },[lastScrollY]);

  return (
    <header className={`Header 
    ${isMain?'MainHeader':''}
    ${headerVisible?'':'headerUp'}
    `}>
      <div className="Header-title">
        <img className="Header-title-img" src={headerImg} />
        <span className="Header-title-txt" onClick={() => navigate("/")}>
          lymming
        </span>
      </div>
      <ul className="Header-ul">
        <li onClick={() => navigate("/participate")}>참여하기</li>
        <li onClick={() => navigate("/teambuild")}>팀 꾸리기</li>
        <li onClick={()=>setIsHiddenBtnOn(!isHiddenBtnOn)}>둘러보기</li>
        <li onClick={() => navigate("/videochat")}>화상채팅</li>

        {login == true ? (
          <li className="login_aft">
            <img />
            <span>username</span>
          </li>
        ) : (
          <li onClick={() => navigate("/login")}>로그인</li>
        )}
      </ul>
      <div className="Header-hidden">
        <div className={`hidden_btn ${isHiddenBtnOn?'HiddenBtnOn':'HiddenBtnOff'}`} onClick={()=>setIsHiddenBtnOn(false)}>
          <div id="btn1" onClick={() => navigate("/member")}>참여자</div>
          <div id="btn2" onClick={() => navigate("/exhibition")}>전시회</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
