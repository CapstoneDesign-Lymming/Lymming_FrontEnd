import "./Header.scss";

const Header = () => {
  return (
    <header className="Header">
      <div className="Header-title">
        <img className="Header-title-img" src="" />
        <span className="Header-title-txt">lymming</span>
      </div>
      <ul className="Header-ul">
        <li>참여하기</li>
        <li>팀 꾸리기</li>
        <li>둘러보기</li>

        {/* 로그인 완료시 상태에 따라 변동시키기 */}
        <li>로그인</li>
      </ul>
    </header>
  );
};

export default Header;
