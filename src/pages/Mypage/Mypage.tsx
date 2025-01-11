import axios from "axios";
import { useEffect, useState } from "react";
import { useToastStore } from "../../store/useToastState";
import { useInfoStore } from "../../store/useLoginStore";
import "./Mypage.scss";
import Header from "../../components/header/Header";
import RootToast from "../../components/Toast/RootToast/RootToast";
import no_profile from "../../assets/img/no-profile.webp";
import infoData from "../../data/loginInfoData.json";
import useImageUpload from "../../hooks/useImageUpload";
import SeoMetaTag from "../../components/Helmet/SeoMetaTag";
interface putDataTypes {
  temperature: number;
  nickname: string;
  position: string;
  job: string;
  stack: string;
  userImg: string | null;
}
const Mypage = () => {
  const { data } = useInfoStore();
  // console.log(data.userImg);
  // const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastName, setToastName] = useState("");
  const [isOpenSelectBox, setIsOpenSelectBox] = useState(false);
  const [isOpenStackBox, setIsOpenStackBox] = useState(false); // 기술 선택 박스 상태 추가
  const [isAllowNickname] = useState<boolean | undefined>(false);
  const [putData, setPutDat] = useState<putDataTypes>({
    temperature: 0,
    nickname: "",
    position: "",
    job: "",
    stack: "",
    userImg: "",
  });
  const [clickImg, setClickImg] = useState(false);
  const [haveNickNameCheck] = useState(false);
  const { isToastOpen, openToast, setErrorText } = useToastStore();
  const { imageUrl, handleFileChange, handleUpload } = useImageUpload();
  const { setData } = useInfoStore();

  useEffect(() => {
    const localData = {
      temperature: data.temperature,
      nickname: data.nickname,
      position: data.position,
      job: data.job,
      stack: data.stack,
      userImg: data.userImg,
    };
    setPutDat(localData);
  }, []);
  const stackArr = putData.stack?.split(",").map((item) => item.trim());

  const updateMyData = async () => {
    const s3url = await handleUpload();
    if (haveNickNameCheck) {
      if (!isAllowNickname) {
        alert("닉네임을 확인해주세요");
        return;
      }
    }
    try {
      //FIXME: axios put login
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/mypage/${data.userId}`,
        {
          userId: data.userId,
          nickname: putData.nickname,
          userImg: s3url || data.userImg,
          stack: putData.stack,
          job: putData.job,
          position: putData.position,
          devStyle: data.devStyle,
          teamperature: data.temperature,
        }
      );

      //TODO: useInfo update
      setData({
        nickname: putData.nickname,
        userImg: s3url || data.userImg,
        stack: putData.stack,
        job: putData.job,
        position: putData.position,
        devStyle: data.devStyle,
      });
      setToastName("successToast");
      openToast();
      return res;
    } catch (error) {
      console.error(error);
      setToastName("errorToast");
      setErrorText("수정에 실패하였습니다");
      openToast();
    }
  };
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target);
  //   const { name, value } = e.target;
  //   setPutDat((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const addOrRemoveStack = (stack: string) => {
    const stackArr = putData.stack
      ?.split(",")
      .filter((item) => item)
      .map((item) => item.trim()); // 공백 제거    console.log("stackArr", stackArr);
    if (stackArr.includes(stack)) {
      // 이미 존재하면 제거
      const updatedStack = stackArr.filter((item) => item !== stack).join(",");
      setPutDat((prevData) => ({
        ...prevData,
        stack: updatedStack,
      }));
    } else {
      // 존재하지 않으면 추가
      const updatedStack =
        stackArr.length > 0 ? `${putData.stack},${stack}` : stack;
      setPutDat((prevData) => ({
        ...prevData,
        stack: updatedStack,
      }));
    }
    setIsOpenStackBox(false); // 선택 박스 닫기
  };

  // const getUserName = async () => {
  //   try {
  //     const res = await axios.get(

  //       {
  //         params: { nickname: putData.nickname },
  //       }
  //     );
  //     if (res.data === true) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  // const nameCheck = async () => {
  //   const res = await getUserName();
  //   setIsAllowNickName(res);
  //   setHaveNickNameCheck(true);
  // };
  return (
    <>
      <Header />
      <SeoMetaTag
        title={"리밍 | 마이페이지"}
        description={"리밍 | 마이페이지에서 내 정보를 수정합니다."}
      />
      <div className="MypageWrapper">
        <div className="Mypage">
          <div className="Mypage-head">마이페이지</div>
          <div className="Mypage-profileWrapper">
            <div className="temperature">{data.temperature}°C</div>
            <img
              className={`profile ${clickImg ? "no_display1" : "display1"}`}
              src={
                data.userImg !== "" && data.userImg !== null
                  ? data?.userImg
                  : no_profile
              }
              alt=""
            />
            <img
              className={`profile ${clickImg ? "display2" : "no_display2"}`}
              src={imageUrl !== "" && imageUrl !== null ? imageUrl : no_profile}
              alt="마이프로필_이미지"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="image-upload"
              name="userImg"
            />
            <div className="putImg">
              <svg
                className="newImgIcon"
                onClick={() => {
                  document.getElementById("image-upload")?.click();
                  setClickImg(true);
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
              </svg>
            </div>
          </div>
          <div className="Mypage-body">
            <div className="input_text">닉네임</div>
            <div className="inputBundle">
              <input
                className="input_box"
                // onChange={handleInputChange}
                name="nickname"
                value={putData.nickname}
              ></input>
              {/* <div className="checkNickName" onClick={nameCheck}>
                중복 확인
              </div> */}
            </div>

            <div className="input_text">포지션</div>
            <div className="tagBundle">
              <div className="tag">{putData.position}</div>
              {/* <div className="delete"> - </div> */}
              <div className="plus" onClick={() => setIsOpenSelectBox(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                </svg>
              </div>
              <div className={`selectBox ${isOpenSelectBox ? "open" : ""}`}>
                <div className="closeBtnWrapper">
                  <svg
                    className="closeBtn"
                    onClick={() => setIsOpenSelectBox(false)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                  </svg>
                </div>
                <div className="positonBundle">
                  {infoData.position.map((item, idx) => (
                    <div
                      className={`newPosition ${
                        putData.position === item ? "selectPosition" : ""
                      }`}
                      key={idx}
                      onClick={() =>
                        setPutDat((prevData) => ({
                          ...prevData,
                          position: item, // position 값 직접 변경
                        }))
                      }
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="input_text">직업</div>
            <div className="tagBundle">
              <select
                className="jobSelect"
                value={putData.job}
                onChange={(e) =>
                  setPutDat((prevData) => ({
                    ...prevData,
                    job: e.target.value, // 선택된 값으로 job 업데이트
                  }))
                }
              >
                <option value="">직업 선택</option> {/* 기본 선택 */}
                <option value="학생">학생</option>
                <option value="직장인">직장인</option>
                <option value="기타">기타</option>
              </select>
            </div>
            {/* 학생 직장인 기타 */}
            <div className="input_text">기술</div>

            <div className="tagBundle">
              <div className="stackWrapper">
                {stackArr.map((item, idx) => (
                  <div className="stackBox" key={idx}>
                    {item}
                  </div>
                ))}
              </div>
              {stackArr.length < 5 && (
                <div className="plus" onClick={() => setIsOpenStackBox(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                  </svg>
                </div>
              )}
              <div className={`selectBox ${isOpenStackBox ? "open" : ""}`}>
                <div className="closeBtnWrapper">
                  <svg
                    className="closeBtn"
                    onClick={() => setIsOpenStackBox(false)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                  </svg>
                </div>
                <div className="stackBundle">
                  {infoData.skills.map((item, idx) => (
                    <div
                      className={`newStack ${
                        stackArr.includes(item) ? "selected" : ""
                      }`}
                      key={idx}
                      onClick={() => addOrRemoveStack(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="Mypage-foot">
            <div className="foot_btn" onClick={updateMyData}>
              수정하기
            </div>
          </div>
        </div>
      </div>
      {isToastOpen && toastName === "successToast" && (
        <RootToast toastName="successToast" />
      )}
      {isToastOpen && toastName === "errorToast" && (
        <RootToast toastName="errorToast" />
      )}
    </>
  );
};

export default Mypage;
