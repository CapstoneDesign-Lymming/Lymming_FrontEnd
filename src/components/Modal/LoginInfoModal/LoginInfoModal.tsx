import { useNavigate } from "react-router-dom";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModal.scss";
import { ReactNode, useState } from "react";
import back from "../../../assets/img/leftrrow.png";
import axios from "axios";
import useImageUpload from "../../../hooks/useImageUpload";

interface Props {
  children: ReactNode;
}

const LoginInfoModal = ({ children }: Props) => {
  const { count, setCount, setCountDown, setIsOpen, setLogin, isExist } =
    useLoginStore();

  const { data, setData } = useInfoStore();
  const token = localStorage.getItem("token");

  const { handleUpload } = useImageUpload();
  const navigate = useNavigate();
  const [localProfileImg, setLocalProfileImg] = useState<string | null>(null);

  const onBtnClick = () => {
    switch (count) {
      case 1:
        if (!data.nickname || !data.gender || !data.job) {
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
        if (data.position === "") {
          window.alert("포지션을 골라주세요");
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
        // 이부분 백엔드에 따라 변경하기
        // 기존 devStyle 값이 있는지 확인하고, 없으면 빈 문자열로 초기화
        const updatedDevStyle = `${data.devStyle}, ${data.work_time}, ${data.with_people}, ${data.working_team}`;

        // devStyle을 업데이트
        setData({ devStyle: updatedDevStyle });
        if (!data.bio) {
          window.alert("소개글을 작성해주세요");
        } else {
          setCount();
        }
        break;
    }
  };
  const uploadImage = async () => {
    console.log("💧uploadImage실행");
    const s3ImageUrl = await handleUpload();

    if (s3ImageUrl) {
      setLocalProfileImg(s3ImageUrl);
      console.log("👍ref로 선언한 loacalProfileImg", localProfileImg); //이미지 경로 들어감
    }
    // if (s3ImageUrl) {
    //   console.log("s3ImageUrl", s3ImageUrl); //ok
    //   setData({ userImg: loacalProfileImg.current });
    //   console.log("s3에 업로드 후 data.userImg", data.userImg); //❌
    // } else {
    //   console.error("Image upload failed; URL is undefined");
    // }
  };

  // const updateUserImg = () => {
  //   setData({ userImg: localProfileImg });
  // };
  const postData = async () => {
    try {
      const res = await axios.put(
        "https://lymming-back.link/api/auth/sign-up",
        {
          position: data.position,
          // 이건 리스트로 넣어야한다
          devStyle: data.devStyle,
          userImg: data.userImg,
          nickname: data.nickname,
          //이거 배열로 가면 안됨
          stack: data.stack,
          gender: data.gender,
          job: data.job,
          bio: data.bio,
          favorites: data.favorites,
          temperature: data.temperature,
          refreshToken: token,
          developer_type: data.developerType,
        }
      );
      setData(res.data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }

    setIsOpen();

    navigate("/");
    setLogin();
  };

  const handleUploadAndPost = async () => {
    //await uploadImage();
    //updateUserImg();
    await postData();
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
          <button onClick={handleUploadAndPost}>완료</button>
        ) : (
          <button onClick={onBtnClick}>다음</button>
        )}
      </div>
    </div>
  );
};

export default LoginInfoModal;
