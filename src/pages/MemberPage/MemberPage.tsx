import { useState } from "react";
import Header from "../../components/header/Header";
import { useInfoStore, useLoginStore } from "../../store/useLoginStore";
import "./MemberPage.scss";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import skills from "../../data/skills.json";
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

const fetchLocalData = async () => {
  const response = await fetch("/json/recommendData.json");
  if (!response.ok) {
    throw new Error("Network error");
  }
  return response.json();
};

const MemberPage = () => {
  const navigate = useNavigate();
  const { data: userData } = useInfoStore();
  const { login } = useLoginStore();

  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null); // 현재 뒤집힌 카드의 인덱스를 관리
  const nickname = userData.nickname;

  console.log("login여부", login);

  const handleClickCard = (index: number) => {
    setFlippedCardIndex(index === flippedCardIndex ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };

  const handleChatClick = (e: React.MouseEvent, nickname: string) => {
    e.stopPropagation();
    console.log("채팅하기 클릭됨");
    navigate("/chat", { state: { id: nickname } });
  };

  const { data, error, isLoading } = useQuery("recommendData", fetchLocalData);
  if (isLoading) return <div>로딩 중!</div>;
  if (error) return <div>에러</div>;

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
              {data.recommendData.map((item: itemType, index: number) => (
                <div
                  key={item.name}
                  className={`recommendCard ${
                    flippedCardIndex === index ? "flipped" : ""
                  }`}
                  onClick={() => handleClickCard(index)}
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
                      <div className="back_body-devStyle">{item.devStyle}</div>
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
              ))}
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

          <div className="Member-body"></div>
        </div>
      </div>
    </>
  );
};

export default MemberPage;
