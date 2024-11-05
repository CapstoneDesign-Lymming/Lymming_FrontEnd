import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import "./ShareDetailPage.scss";
import ShareDetailCommon from "../../components/ShareDetailComponent/ShareDetailCommon";

const ShareDetailPage = () => {
  //TODO: 1.방장id와 내 id를 비교하여 같다면 수정권한 부여-> 수정 가능한 페이지로 전환
  //2.일반적인 view로 구현
  //3.
  const location = useLocation();
  const data = location.state;
  return (
    <>
      <Header />
      <div className="ShareDetailPageWrapper">
        <ShareDetailCommon data={data} />
      </div>
    </>
  );
};

export default ShareDetailPage;
