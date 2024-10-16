import Header from "../../components/header/Header";
import "./Main.scss";
import mainData from "../../data/maindata.json";

const Main = () => {
  return (
    <div className="Main">
      <Header />
      <div className="image_wrapper">
        <img className="image_wrapper-img" />
      </div>

      <div className="info1">
        <div className="info1-content">
          <div className="info1-content-left">
            <span className="info1-content-left-head">lymming</span>
            <span className="info1-content-left-body">
              여러 서비스를 통해
              <br /> 팀원 정보를 간편하게 <br /> 제공합니다
            </span>
          </div>
          <div className="info1-content-right">
            {mainData.info1.map((it) => {
              return (
                <div className="info1-content-right-box">
                  <span className="info1-content-right-box-head">
                    {it.title}
                  </span>
                  <span className="info1-content-left-body">{it.data}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="info2">
        <div className="info2-left">
          <span className="info2-left-txt1">혼자 고민했던 문제들</span>
          <span className="info2-left-txt2">리밍으로 해결하세요</span>
        </div>
        <div className="info2-right">
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
          <div className="info2-right-box">
            <span className="info2-right-box-img">😀</span>
            <span className="info2-right-box-txt">리밍으로 해결하세요</span>
          </div>
        </div>
      </div>

      <div className="info3">
        <div className="info3-title">
          <span className="info3-title-step">step1</span>
          <span className="info3-title-text">프로젝트를 구성해보세요.</span>
        </div>
        <div className="info3-progressbar"></div>
        <div className="info3-img"></div>
      </div>

      <footer className="footer">
        <div className="footer-title">
          <img />
          <span>lymming</span>
        </div>
        <div className="footer-profile">
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">박준서</span>
            <span className="footer-profile-box-span2">빅데이터 20205175</span>
            <span>깃허브</span>
          </div>
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">박준서</span>
            <span className="footer-profile-box-span2">빅데이터 20205175</span>
            <span>깃허브</span>
          </div>
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">박준서</span>
            <span className="footer-profile-box-span2">빅데이터 20205175</span>
            <span>깃허브</span>
          </div>
        </div>

        <div className="footer-license">
          <hr />
          <span className="footer-license-txt">
            © 2024 Hallym University Capstone Design
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Main;
