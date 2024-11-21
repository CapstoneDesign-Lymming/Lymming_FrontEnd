import { useState } from "react";
import { useQuery } from "react-query";
import { useToastStore } from "../../store/useToastState";
import { useInfoStore } from "../../store/useLoginStore";
import "./Mypage.scss";
import Header from "../../components/header/Header";
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import RootToast from "../../components/Toast/RootToast/RootToast";
import no_profile from "../../assets/img/no-profile.webp";
import axios from "axios";
const Mypage = () => {
  const { data } = useInfoStore();
  // console.log(data.userImg);
  // const [isToastOpen, setIsToastOpen] = useState(false);
  const { isToastOpen, openToast, setErrorText } = useToastStore();
  const [toastName, setToastName] = useState("");
  // const [putData, setPutDat] = useState();
  const fetchMypageData = () => {
    console.log("data", data);

    return data;
  };

  const updateMyData = async () => {
    try {
      //FIXME: axios put login
      const res = await axios.put(
        `https://lymming-back.link//api/mypage/${data.userId}`,
        {}
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
    //TODO: 수정하기 post변경
    /**{
    ”userId” : “long”,
    "nickname": "string",
    ”job”: “String”,
    "postion": "string",
    ”stack”: “String” } 
    */
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);
  };
  const { error, isLoading } = useQuery("mypgage", fetchMypageData);
  if (error) return <Error />;
  if (isLoading) return <Loading />;
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
              value={data.nickname}
            ></input>
            <div className="input_text">포지션</div>
            <input
              className="input_box"
              onChange={handleInputChange}
              value={data.position}
            ></input>
            <div className="input_text">직업</div>
            <input
              className="input_box"
              onChange={handleInputChange}
              value={data.job}
            ></input>
            <div className="input_text">기술</div>
            <input
              className="input_box"
              onChange={handleInputChange}
              value={data.stack}
            ></input>
          </div>
          <div className="Mypage-foot">
            <div className="foot_btn" onClick={updateMyData}>
              수정하기{" "}
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
