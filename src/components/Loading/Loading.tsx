import lymming_logo from "../../assets/img/lymming_logo.png";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import login_loading from "../../assets/lottie/login_loading.json";
import { useRef } from "react";
import "./Loading.scss";

const Loading = () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  return (
    <>
      <div className="LoginLoadingWrapper">
        <div className="LoginLoading">
          <Lottie
            animationData={login_loading}
            loop
            autoPlay
            lottieRef={lottieRef}
            className="login_loading"
          />
          <div className="nav_buncle">
            <img src={lymming_logo} alt="" />

            <div className="nav">
              리밍이 당신을 위한 서비스를 준비하고 있어요
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
