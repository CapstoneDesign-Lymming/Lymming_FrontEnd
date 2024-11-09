import Header from "../../components/header/Header";
import { useInfoStore } from "../../store/useLoginStore";
import "./MemberPage.scss";
import { useQuery } from "react-query";

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
  const { data: userData } = useInfoStore();
  const nickname = userData.nickname;
  const { data, error, isLoading } = useQuery("recommendData", fetchLocalData);
  if (isLoading) return <div>로딩 중!</div>;
  if (error) return <div>에러</div>;
  return (
    <>
      <Header />
      <div className="Member">
        <div className="Member-header">
          <div className="Member-header-text">
            {nickname}님께 어울리는 사람을 추천해드립니다.
          </div>

          <div className="Member-header-recommend">
            {data.recommendData.map((item: itemType) => (
              <div className="recommendCard">
                <div>{item.name}</div>
                <div>{item.position}</div>
                <img src={`${item.userImg}`} alt="" />
              </div>
            ))}
          </div>
        </div>
        <div className="Member-body"></div>
      </div>
    </>
  );
};

export default MemberPage;
