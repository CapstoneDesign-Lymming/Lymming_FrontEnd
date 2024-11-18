import Lottie from "lottie-react";
import "./Error.scss";
import waring from "../../assets/lottie/warning.json";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="ErrorWrapper">
      <Lottie className="error_lottie" animationData={waring} />
      <div className="bigText">잠시 서비스를 제공해드리지 못하고 있어요.</div>
      <div className="smallText">네트워크를 확인해 주세요.</div>
      <div
        className="to_home"
        onClick={() => {
          navigate("/");
        }}
      >
        홈으로 돌아가기
      </div>
    </div>
  );
};

export default Error;
