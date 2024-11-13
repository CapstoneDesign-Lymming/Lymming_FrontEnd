import { useState } from "react";
import Header from "../../components/header/Header";
import { useInfoStore } from "../../store/useLoginStore";
import "./MemberPage.scss";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

interface itemType {
  name: string;
  userImg: string;
  githubUrl: string;
  keywords: string[];
  skills: string[];
  position: string;
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
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null); // 현재 뒤집힌 카드의 인덱스를 관리
  const nickname = userData.nickname;

  const handleClickCard = (index: number) => {
    setFlippedCardIndex(index === flippedCardIndex ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };
  const handleChatClick = (e: React.MouseEvent, nickname: string) => {
    e.stopPropagation(); // 이벤트 전파를 막아서 카드 뒤집기 동작을 막습니다.
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
          <div className="Member-header">
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
                    <div className="back_body"></div>
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
          <div className="Member-body"></div>
        </div>
      </div>
    </>
  );
};

export default MemberPage;
