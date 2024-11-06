import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../store/useLoginStore";
import axios from "axios";

const KakaoAuth = () => {
  const navigate = useNavigate();
  const { setIsOpen } = useLoginStore();

  useEffect(() => {
    postKakaoCode(code);
  }, []);

  const queryString = window.location.search; // URL 쿼리 스트링 가져오기
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code"); // 'code' 파라미터 값을 가져오기

  // 서버로 인가코드 전송
  const postKakaoCode = async (code: any) => {
    console.log("로그인", code);
    try {
      const result = await axios.post("http://localhost:8080/api/kakao/login", {
        code,
      });

      // 리턴값으로 토큰 날라온다
      localStorage.setItem("token", result.data);
      console.log("로그인", result.data);

      getUserData();
    } catch (e) {
      console.error(e);
    }
  };

  // 서버로부터 사용자 data를 받아온다
  // 토큰으로 사용자 data가 있을경우 홈으로 이동 없는경우 모달을 띄운다
  const getUserData = async () => {
    setIsOpen();
    navigate("/login");
    /*
    const token = localStorage.getItem("token");
    try {
      // 임시 경로
      const res = await axios.get("http://localhost:8080/api/kakao/login", {
        params: { token },
      });

      console.log(res);

      //데이터 요청후
      //데이터 없을경우
      if (res.data) {
        //       setLogin(true);
        // 서버에서 받은 data로 사용자 저장
        useInfoStore(res.data);
        navigate("/");
      } else {
        //데이터 있는경우
        setIsOpen();
        navigate("/login");
      }
    } catch (e) {
      console.error(e);
    }
      */
  };

  return (
    <div className="KakaoAuth">
      <h1>로그인 중입니다.</h1>
    </div>
  );
};

export default KakaoAuth;
