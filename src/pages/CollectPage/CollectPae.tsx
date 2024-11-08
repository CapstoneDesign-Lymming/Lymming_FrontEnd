import Header from "../../components/header/Header";
import "./CollectPage.scss";

const CollectPage = () => {
  return (
    <div className="CollectPage">
      <Header />

      <div className="tab">
        <span>내가 쓴 글</span>
        <span>내가 찜한 글</span>
      </div>
      <div className="content"></div>
    </div>
  );
};

export default CollectPage;
