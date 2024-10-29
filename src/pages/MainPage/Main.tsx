import Header from "../../components/header/Header";
import "./Main.scss";
import mainData from "../../data/maindata.json";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import leftbtn from "../../assets/img/leftrrow.png";
import rightbtn from "../../assets/img/rigntarrow.png";
import logo from "../../assets/img/lymming_logo.png";

const Main = () => {
  const [isBack, setIsBack] = useState(false);
  const [visible, setVisible] = useState(0);

  const contentVariants = {
    initial: (isBack: boolean) => ({
      x: isBack ? 500 : -500,
      opacity: 0,
      scale: 0.5,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (isBack: boolean) => ({
      x: isBack ? -500 : 500,
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.5,
      },
    }),
  };

  const handleNext = () => {
    setIsBack(true); // 앞으로 가는 애니메이션
    console.log(visible);
    setVisible((prevIndex) => (prevIndex + 1) % mainData.info3.length); // 다음 인덱스로
  };

  const handlePrev = () => {
    setIsBack(false); // 뒤로 가는 애니메이션
    setVisible((prevIndex) =>
      prevIndex === 0 ? mainData.info3.length - 1 : prevIndex - 1
    ); // 이전 인덱스로
  };

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
            {mainData.info1.map((it, index) => {
              return (
                <div className="info1-content-right-box" key={index}>
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
          {mainData.info2.map((it, index) => {
            return (
              <div className="info2-right-box" key={index}>
                <span className="info2-right-box-img">{it.title}</span>
                <span className="info2-right-box-txt">{it.data}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="info3">
        <div className="progressbar">
          {mainData.info3.map((it, index) => (
            <span
              className={`circle ${index === visible ? "active" : ""}`}
              key={index}
            ></span>
          ))}

          <div className="progress-bar"></div>
        </div>

        <div className="btn-wrapper">
          <button className="arrow" onClick={handlePrev}>
            <img src={leftbtn} />
          </button>

          <button className="arrow" onClick={handleNext}>
            <img src={rightbtn} />
          </button>
        </div>

        <AnimatePresence>
          {mainData.info3.map((it, index) => {
            return visible === index ? (
              <motion.div
                key={index}
                custom={isBack} // custom 속성을 통해 isBack을 전달
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="scroll"
              >
                <div className="title">
                  <span className="title-step">{it.title}</span>
                </div>

                <div className="img"></div>
              </motion.div>
            ) : null;
          })}
        </AnimatePresence>
      </div>

      <footer className="footer">
        <div className="footer-title">
          <img src={logo} />
          <span>lymming</span>
        </div>
        <div className="footer-profile">
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">박준서</span>
            <span className="footer-profile-box-span2">빅데이터 20205175</span>
            <span>깃허브</span>
          </div>
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">노기훈</span>
            <span className="footer-profile-box-span2">빅데이터 20205160</span>
            <span>깃허브</span>
          </div>
          <div className="footer-profile-box">
            <span className="footer-profile-box-span1">지우림</span>
            <span className="footer-profile-box-span2">빅데이터 20202849</span>
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
