import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import "./ShareDetailPage.scss";
import { useLoginStore } from "../../store/useLoginStore";
import ShareDetailLeader from "../../components/ShareDetailComponent/ShareDetailLeader";
import ShareDetailCommon from "../../components/ShareDetailComponent/ShareDetailCommon";

const ShareDetailPage = () => {
  //TODO: 1.방장id와 내 id를 비교하여 같다면 수정권한 부여-> 수정 가능한 페이지로 전환
  //2.일반적인 view로 구현
  //3.
  const location = useLocation();
  const data = location.state;
  const { username } = useLoginStore();
  return (
    <>
      <Header />
      <div className="ShareDetailPageWrapper">
        {data && data.team_leader === username ? (
          <ShareDetailLeader data={data} />
        ) : (
          <ShareDetailCommon data={data} />
        )}
        {!data && <div>data가 안넘어왔습니다.ㅣ</div>}
      </div>
    </>
  );
};

export default ShareDetailPage;
