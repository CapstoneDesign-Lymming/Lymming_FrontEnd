import { useQuery } from "react-query";
import Header from "../../components/header/Header";
import { useInfoStore } from "../../store/useLoginStore";
import "./Mypage.scss";
import no_profile from "../../assets/img/no-profile.webp";
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
const Mypage = () => {
  const { data } = useInfoStore();
  console.log(data.userImg);

  const fetchMypageData = () => {
    return data;
  };

  const updateMyData = () => {
    //TODO: 수정하기 post변경
    /**{
    ”userId” : “long”,
    "nickname": "string",
    ”job”: “String”,
    "postion": "string",
    ”stack”: “String” } 
    */
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
            <input className="input_box" value={data.nickname}></input>
            <div className="input_text">포지션</div>
            <input className="input_box" value={data.position}></input>
            <div className="input_text">직업</div>
            <input className="input_box" value={data.job}></input>
            <div className="input_text">기술</div>
            <input className="input_box" value={data.stack}></input>
          </div>
          <div className="Mypage-foot">
            <div className="foot_btn" onClick={updateMyData}>
              수정하기{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mypage;
