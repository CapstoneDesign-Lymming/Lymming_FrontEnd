import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useLoginStore } from "../../store/useLoginStore";

const Header = () => {
  const navigate = useNavigate();

  const { login } = useLoginStore();

  return (
    <header className="Header">
      <div className="Header-title">
        <img className="Header-title-img" src="" />
        <span className="Header-title-txt" onClick={() => navigate("/")}>
          lymming
        </span>
      </div>
      <ul className="Header-ul">
        <li onClick={() => navigate("/participate")}>참여하기</li>
        <li onClick={() => navigate("/teambuild")}>팀 꾸리기</li>
        <li>둘러보기</li>

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
