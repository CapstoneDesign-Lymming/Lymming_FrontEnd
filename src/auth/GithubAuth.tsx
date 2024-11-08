import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../store/useLoginStore";

const GithubAuth = () => {
  const navigate = useNavigate();
  const { setIsOpen } = useLoginStore();

  useEffect(() => {
    postGithubCode(code);
  }, []);

  const queryString = window.location.search; // URL 쿼리 스트링 가져오기
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code"); // 'code' 파라미터 값을 가져오기

  // 서버로 인가코드 전송
  const postGithubCode = async (code: any) => {
    console.log("로그인", code);
    try {
      const result = await axios.post(
        "https://lymming-back.link/api/login/code/github",
        {
          code,
        }
      );

      //  사용자 정보를 로컬 스터리지에 저장
      localStorage.setItem("token", result.data);

      console.log("로그인", result.data);
      getUserData();
    } catch (e) {
      console.error(e);
    }
  };

  // 서버로부터 사용자 data를 받아온다
  // 사용자 data가 있을경우 홈으로 이동 없는경우 모달을 띄운다
  const getUserData = () => {
    //데이터 요청후
    //데이터 없을경우
    setIsOpen();
    navigate("/login");

    //데이터 있는경우
    // setLogin(true);
    //navigate("/");
  };

  return (
    <div className="GithubAuth">
      <h1>로그인 중입니다.</h1>
    </div>
  );
};

export default GithubAuth;
