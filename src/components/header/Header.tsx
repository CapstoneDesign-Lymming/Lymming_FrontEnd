import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useLoginStore } from "../../store/useLoginStore";

const Header = () => {
  const navigate = useNavigate();

  const { login } = useLoginStore();

  return (
    <header className="Header">
      <div className="Header-title">
        <img className="Header-title-img" src="../../assets/img/lymming_logo.png" />
        <span className="Header-title-txt">lymming</span>
      </div>
      <ul className="Header-ul">
        <li onClick={() => navigate("/participate")}>참여하기</li>
        <li>팀 꾸리기</li>
        <li>둘러보기</li>
        <li onClick={() => navigate("/videochat")}>화상채팅</li>

        {/* 로그인 완료시 상태에 따라 변동시키기 */}

        {login == true ? (
          <li className="login_aft">
            <img />
            <span>username</span>
          </li>
        ) : (
          <li onClick={() => navigate("/login")}>로그인</li>
        )}
      </ul>
    </header>
  );
};

export default Header;
