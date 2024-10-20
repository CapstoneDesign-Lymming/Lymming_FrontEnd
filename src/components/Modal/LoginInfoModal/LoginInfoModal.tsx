import { useNavigate } from "react-router-dom";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModal.scss";

const LoginInfoModal = ({ children }) => {
  const { count, setCount, setIsOpen } = useLoginStore();
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
    setIsOpen(false);
  };

  return (
    <div className="LoginInfoModal">
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
