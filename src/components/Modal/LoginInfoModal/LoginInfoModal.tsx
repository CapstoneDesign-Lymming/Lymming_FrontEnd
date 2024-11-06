import { useNavigate } from "react-router-dom";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModal.scss";
import { ReactNode } from "react";
import back from "../../../assets/img/leftrrow.png";

interface Props {
  children: ReactNode;
}

const LoginInfoModal = ({ children }: Props) => {
  const { count, setCount, setCountDown, setIsOpen, setLogin } =
    useLoginStore();
  const { data } = useInfoStore();

  const navigate = useNavigate();

  const onBtnClick = () => {
    console.log(data.introduce);
    switch (count) {
      case 1:
        if (!data.name || !data.gender || !data.job || !data.category) {
          window.alert("모든 항목을 완료해주세요");
        } else {
          setCount();
        }
        break;
      case 2:
        if (data.skills.length == 0) {
          window.alert("최소 한개 이상의 항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 3:
        if (data.interest.length == 0) {
          window.alert("최소 한개 이상의 항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 4:
        if (!data.time) {
          window.alert("항목을 선택해주세요");
        } else {
          setCount();
        }
        break;
      case 5:
        if (!data.introduce) {
          window.alert("소개글을 작성해주세요");
        } else {
          setCount();
        }
        break;
    }
  };

  const postData = async () => {
    console.log(data);
    //폼데이터 서버에 보내는 로직추가하기
    //데이터 존재하면 로그인 완료
    // 데이터 없으면 모달 open
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
        {count === 6 ? (
          <button onClick={postData}>완료</button>
        ) : (
          <button onClick={onBtnClick}>다음</button>
        )}
      </div>
    </div>
  );
};

export default LoginInfoModal;
