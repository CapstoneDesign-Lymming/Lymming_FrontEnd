import { useEffect, useState } from "react";
import { useToastStore } from "../../store/useToastState";
import { useInfoStore } from "../../store/useLoginStore";
import "./Mypage.scss";
import Header from "../../components/header/Header";
import RootToast from "../../components/Toast/RootToast/RootToast";
import no_profile from "../../assets/img/no-profile.webp";
import axios from "axios";
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
  const { isToastOpen, openToast, setErrorText } = useToastStore();
  const [toastName, setToastName] = useState("");
  const [putData, setPutDat] = useState<putDataTypes>({
    temperature: 0,
    nickname: "",
    position: "",
    job: "",
    stack: "",
    userImg: "",
  });

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
  const stackArr = putData.stack?.split(",");
  const updateMyData = async () => {
    try {
      //FIXME: axios put login
      const res = await axios.put(
        `https://lymming-back.link/api/mypage/${data.userId}`,
        {
          userId: data.userId,
          nickname: data.nickname,
          job: putData.job,
          position: putData.position,
          stack: putData.stack,
        }
      );
      console.log("수정하기 성공");
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);
    const { name, value } = e.target;
    setPutDat((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <div className="MypageWrapper">
        <div className="Mypage">
          <div className="Mypage-head">마이페이지</div>
          <div className="Mypage-profileWrapper">
            <div className="temperature">{data.temperature}°C</div>
            <img
              className="profile"
              src={
                data.userImg !== "" && data.userImg !== null
                  ? data?.userImg
                  : no_profile
              }
              alt=""
            />
          </div>
          <div className="Mypage-body">
            <div className="input_text">닉네임</div>
            {/* TODO:  */}
            <input
              className="input_box"
              onChange={handleInputChange}
              name="nickname"
              value={putData.nickname}
            ></input>
            <div className="input_text">포지션</div>
            <input
              className="input_box"
              onChange={handleInputChange}
              name="position"
              value={putData.position}
            ></input>
            <div className="input_text">직업</div>
            <input
              className="input_box"
              onChange={handleInputChange}
              name="job"
              value={putData.job}
            ></input>
            <div className="input_text">기술</div>
            <div className="stackWrapper">
              {stackArr.map((item, idx) => (
                <div className="stackBox" key={idx}>
                  {item}
                </div>
              ))}
            </div>

            {/* <input
              className="input_box"
              onChange={handleInputChange}
              name="stack"
              value={putData.stack}
            ></input> */}
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
