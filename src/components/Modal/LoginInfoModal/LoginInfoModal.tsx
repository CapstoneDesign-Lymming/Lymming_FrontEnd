import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModal.scss";

const LoginInfoModal = ({ children }) => {
  const { count, setCount, setIsOpen, setLogin } = useLoginStore();

  const navigate = useNavigate();

  return (
    <div className="LoginInfoModal">
      <div className="child_wrqpper">{children}</div>
      <div className="btn_wrqpper">
        {count === 6 ? (
          <button
            onClick={() => {
              setIsOpen(false);
              setLogin(true);
              navigate("/");
            }}
          >
            완료
          </button>
        ) : (
          <button onClick={() => setCount(1)}>다음</button>
        )}
      </div>
    </div>
  );
};

export default LoginInfoModal;
