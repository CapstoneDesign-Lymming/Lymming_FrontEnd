import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MemberPage.scss";
import Header from "../../components/header/Header";
import { useInfoStore, useLoginStore } from "../../store/useLoginStore";
import LoginLoading from "../../components/Loading/LoginLoading/LoginLoading";
import skills from "../../data/skills.json";
import no_profile from "../../assets/img/no-profile.webp";
interface itemType {
  name: string;
  userImg: string;
  githubUrl: string;
  keywords: string[];
  skills: string[];
  position: string;
  devStyle: string;
  bio: string;
}

interface memberType {
  userId: number;
  nickname: string;
  job: string;
  position: string;
  userImg: string;
  stack: string[];
  devStyle: string[];
  teamperature: number;
  projectId: string;
  projectName: string;
  deadline: string[];
}

const fetchLocalData = async () => {
  const response = await fetch("/json/recommendData.json");
  if (!response.ok) {
    throw new Error("Network error");
  }
  return response.json();
};

const fetchMember = async () => {
  console.log("dddd");
  const response = await axios.get("https://lymming-back.link/member/list");
  console.log("member/list의 데이터", response.data);
  return response.data;
};

const MemberPage = () => {
  const navigate = useNavigate();
  const { data: userData } = useInfoStore();
  const { login } = useLoginStore();
  const [flippedRecommendIdx, setFlippedRecommendIdx] = useState<number | null>(
    null
  ); // 현재 뒤집힌 카드의 인덱스를 관리
  const [flippedMemberdIdx, setFlippedMemberIdx] = useState<number | null>(
    null
  ); // 현재 뒤집힌 카드의 인덱스를 관리

  const nickname = userData.nickname;
  console.log("login여부", login);

  const handleClickRecommend = (index: number) => {
    setFlippedRecommendIdx(index === flippedRecommendIdx ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };
  const handleClickMember = (index: number) => {
    setFlippedMemberIdx(index === flippedMemberdIdx ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };
  const handleChatClick = (e: React.MouseEvent, nickname: string) => {
    e.stopPropagation();
    console.log("채팅하기 클릭됨");
    navigate("/chat", { state: { id: nickname } });
  };

  const {
    data: recommendQuery,
    error: recommendError,
    isLoading: recommendLoading,
  } = useQuery("recommendData", fetchLocalData);

  const {
    data: memberQuery,
    error: memberError,
    isLoading: memberLoading,
  } = useQuery("memberData", fetchMember);

  if (recommendLoading || memberLoading)
    return (
      <>
        <Header />
        <LoginLoading />;
      </>
    );

  if (recommendError || memberError) return <div>에러</div>;

  return (
    <>
      <Header />
      <div className="MemberWrapper">
        <div className="Member">
          <div
            className={`Member-header ${login ? "" : "notLogin_MemberHeader"}`}
          >
            <div className="Member-header-text">
              {nickname}님께 어울리는 사람을 추천해드립니다.
            </div>

            <div className="Member-header-recommend">
              {recommendQuery.recommendData.map(
                (item: itemType, index: number) => (
                  <div
                    key={item.name}
                    className={`recommendCard ${
                      flippedRecommendIdx === index ? "recommendFlipped" : ""
                    }`}
                    onClick={() => handleClickRecommend(index)}
                  >
                    <div className="front">
                      <div className="recommend_name">{item.name}</div>
                      <div className="recommend_position">{item.position}</div>
                      <img src={`${item.userImg}`} alt="" />
                    </div>
                    <div className="back">
                      <div className="recommend_name">{item.name}</div>
                      <div className="recommend_position">{item.position}</div>
                      <div className="back_body">
                        <div className="back_body-devStyle">
                          {item.devStyle}
                        </div>
                        <div className="back_body-skillWrapper">
                          {" "}
                          {item.skills.map((skill, index) => {
                            // 이름이 일치하는 skill 객체를 찾습니다.
                            const matchedSkill = skills.skills.find(
                              (s) => s.name === skill
                            );

                            return (
                              <div key={index} className="back_body-skill">
                                {matchedSkill && (
                                  <img
                                    src={matchedSkill.url}
                                    alt={skill}
                                    className="skill_icon"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div
                        className="back_footerWrapper"
                        onClick={(e) => handleChatClick(e, item.name)}
                      >
                        <div className="back_footer">채팅하기</div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className={`${login ? "hide_notLogin_nav" : "notLogin_nav"}`}>
            <div className="notLogin_nav-head">
              당신에게 어울리는 팀원을 찾아드립니다
            </div>
            <div className="notLogin_nav-body">
              로그인 이후에 추천 기능을 이용해보세요
            </div>
            <div
              className="notLogin_nav-foot"
              onClick={() => navigate("/login")}
            >
              로그인하고 바로보기
            </div>
          </div>
          <div className="line">
            <div>직무</div>
            <div>스킬</div>
          </div>
          <div className="Member-body">
            {memberQuery.map((item: memberType, index: number) => (
              <div
                className={`CardWrapper ${
                  flippedMemberdIdx === index ? "memberflipped" : ""
                }`}
                key={index}
                onClick={() => handleClickMember(index)}
              >
                <div className="bodyCard_frontWrapper">
                  <div className="bodyCard_front">
                    <div className="top">
                      <div className="nickname">
                        {item.nickname || "리밍이"}
                      </div>
                      <div className="position">
                        {item.position || "SW Engineer"}
                      </div>
                    </div>
                    <div className="body">
                      <img src={item.userImg || no_profile} alt="" />
                    </div>
                    <div className="foot">
                      <svg
                        className="chatIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.8 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bodyCard_backWrapper">
                  <div className="bodyCard_back">asdasdf</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberPage;
