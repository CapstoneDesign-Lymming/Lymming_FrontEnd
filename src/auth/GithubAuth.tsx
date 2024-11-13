import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInfoStore, useLoginStore } from "../store/useLoginStore";

const GithubAuth = () => {
  const navigate = useNavigate();
  const { setIsOpen, setLogin } = useLoginStore();
  const { data, setData } = useInfoStore();

  useEffect(() => {
    postGithubCode(code);
  }, []);

  const queryString = window.location.search; // URL 쿼리 스트링 가져오기
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code"); //'code' 파라미터 값을 가져오기

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
      localStorage.setItem("token", result.data.jwt);

      console.log("로그인", result.data.jwt);

      // 있으면
      //홈으로 이동
      //userInfo 데이터를 불러온 데이터로 세팅한다
      // 로그인 상태를 true로 만든다
      if (result.data.user.nickname) {
        setData(result.data.user);
        setLogin();
        navigate("/");
      }

      // 회원가입 정보중 닉네임등의 정보가 추가되어 있지 않으면
      // 회원 가입 모달을 띄운다
      //로그인 페이지로 네비게이트 한다
      else {
        setIsOpen();
        navigate("/login");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="GithubAuth">
      <h1>로그인 중입니다.</h1>
    </div>
  );
};

export default GithubAuth;
