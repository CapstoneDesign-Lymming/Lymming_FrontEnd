import { useNavigate } from "react-router-dom";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModal.scss";
import { ReactNode } from "react";
import back from "../../../assets/img/leftrrow.png";
import axios from "axios";

interface Props {
  children: ReactNode;
}

const LoginInfoModal = ({ children }: Props) => {
  const { count, setCount, setCountDown, setIsOpen, setLogin, isExist } =
    useLoginStore();
  const { data } = useInfoStore();
  const token = localStorage.getItem("token");
  console.log(token);

  const navigate = useNavigate();

  const onBtnClick = () => {
    switch (count) {
      case 1:
        if (!data.nickname || !data.gender || !data.job || !data.category) {
          window.alert("모든 항목을 완료해주세요");
        } else if (isExist == false) {
          window.alert("닉네임 중복체크를 완료해주세요");
        } else {
          setCount();
        }
        break;
      case 2:
        if (data.stack.length == 0) {
          window.alert("최소 한개 이상의 항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 3:
        if (data.interests.length == 0) {
          window.alert("최소 한개 이상의 항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 4:
        if (data.work_time === "") {
          window.alert("항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 5:
        if (data.working_team === "") {
          window.alert("항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 6:
        if (data.devStyle === "") {
          window.alert("항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 7:
        if (data.with_people === "") {
          window.alert("항목을 선택해주세요");
        } else {
          setCount();
        }
        break;

      case 8:
        if (!data.bio) {
          window.alert("소개글을 작성해주세요");
        } else {
          setCount();
        }
        break;
    }
  };

  const postData = async () => {
    try {
      const res = await axios.put(
        "https://lymming-back.link/api/auth/sign-up",
        {
          ...data,
          refreshToken: token,
          //여기는 백엔드 api 수정되면 열기
          //developer_type: userType,
        }
      );
      console.log(res);
    } catch (e) {
      console.error(e);
    }

    setIsOpen();

    navigate("/");
    setLogin();
  };

  return (
    <div className="LoginInfoModal">
      <div className="header">
        <button
          onClick={() => {
            if (count - 1 >= 1) {
              setCountDown();
            }
          }}
          style={{ display: count == 1 ? "none" : "inline" }}
        >
          <img src={back} />
        </button>
      </div>
      <div className="child_wrqpper">{children}</div>
      <div className="btn_wrqpper">
        {count === 9 ? (
          <button onClick={postData}>완료</button>
        ) : (
          <button onClick={onBtnClick}>다음</button>
        )}
      </div>
    </div>
  );
};

export default LoginInfoModal;
