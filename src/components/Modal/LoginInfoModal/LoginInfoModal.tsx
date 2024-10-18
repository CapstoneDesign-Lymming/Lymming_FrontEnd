import "./LoginInfoModal.scss";

const LoginInfoModal = ({ button, children }) => {
  console.log(button);
  return (
    <div className="LoginInfoModal">
      <div className="child_wrqpper">{children}</div>
      <div className="btn_wrqpper">
        <button>{button === 6 ? "완료" : "다음"}</button>
      </div>
    </div>
  );
};

export default LoginInfoModal;
