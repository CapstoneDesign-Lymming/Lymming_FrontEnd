import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Header from "../../components/header/Header";
import "./Main.scss";
// import data from "../../../public/json/mainData.json";
// import leftbtn from "../../assets/img/leftrrow.png";
// import rightbtn from "../../assets/img/rigntarrow.png";
import logo from "../../assets/img/lymming_logo.png";
import iphone from "../../assets/img/iphone.png";
import main_lottie1 from "../../assets/lottie/main-lottie1.json";
import main_lottie2 from "../../assets/lottie/main-lottie2.json";
// import chat_img from "../../assets/img/chat_img.png";
// interface InfoItem {
//   title: string;
//   data: string;
// }

// interface MainData {
//   info1: InfoItem[];
//   info2: InfoItem[];
//   info3: InfoItem[];
// }
/**main page의 처음 올라오는 shpae요소의 framer motion */
const shapeVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.4, ease: "backOut" },
  },
};

const Main = () => {
  // const mainData: MainData = data;
  // const [isBack, setIsBack] = useState(false);
  // const [visible, setVisible] = useState(0);
  const navigate = useNavigate();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // 속도를 0.5배로 설정 (느리게)
    }
  }, []);

  // const contentVariants = {
  //   initial: (isBack: boolean) => ({
  //     x: isBack ? 500 : -500,
  //     opacity: 0,
  //     scale: 0.5,
  //   }),
  //   animate: {
  //     x: 0,
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       duration: 0.5,
  //     },
  //   },
  //   exit: (isBack: boolean) => ({
  //     x: isBack ? -500 : 500,
  //     opacity: 0,
  //     scale: 0,
  //     transition: {
  //       duration: 0.5,
  //     },
  //   }),
  // };

  // const handleNext = () => {
  //   setIsBack(true); // 앞으로 가는 애니메이션
  //   console.log(visible);
  //   setVisible((prevIndex) => (prevIndex + 1) % mainData.info3.length); // 다음 인덱스로
  // };

  // const handlePrev = () => {
  //   setIsBack(false); // 뒤로 가는 애니메이션
  //   setVisible((prevIndex) =>
  //     prevIndex === 0 ? mainData.info3.length - 1 : prevIndex - 1
  //   ); // 이전 인덱스로
  // };

  return (
    <>
      <Header />
      <div className="Main">
        <div className="Main-headerWrapper">
          {/* <img className="image_wrapper-img" /> */}
          <motion.div
            className="shape1"
            initial="hidden"
            animate="visible"
            variants={shapeVariants}
          />

          <div className="MainTitle">효율적인 프로젝트의 시작, 리밍에서</div>

          <div className="MainSubTitle">
            팀원 모집부터 프로젝트 참여, 프로젝트 전시까지 이곳에서 즐겨보세요.
          </div>
          <motion.div
            className="MainNavbtn"
            onClick={() => navigate("/participate")}
            whileHover={{
              scale: 1.1,
            }}
            initial="hidden"
            animate="visible"
            variants={shapeVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            지금 시작하기
          </motion.div>
        </div>
        <div className="info1">
          <div className="info1-content">
            <motion.img className="iphone" src={iphone} alt="iphone" />
            <div className="leftWrapper">
              <div className="in_iphone">
                <div className="right_Msg">
                  프로젝트를 시작하고 싶은데 어디서 구하지?
                </div>
                <div className="right_Msg">
                  나에게 맞는 팀원으로 구하고 싶어
                </div>
                <div className="right_Msg">
                  다른 사람들의 정보를 확인하고 싶어
                </div>
                <div className="right_Msg">
                  프로젝트를 시작하고 관리도 하고 싶은데...
                </div>
                {/* <div className="right_Msg">이번에 어디서</div> */}
                <div className="left_Msg">나야, 리밍...</div>
              </div>
            </div>
            <div className="rightWrapper">
              <div className="right">
                <div className="right-card1 cardBundle">
                  <Lottie
                    animationData={main_lottie1}
                    loop
                    autoPlay
                    lottieRef={lottieRef}
                    className="main_lottie"
                  />
                  <div className="card_text1">프로젝트에 참가해보세요.</div>
                  <div className="card_text2">
                    프로젝트는 물로, 스터디도 함께 실시간으로 참여할 수
                    있습니다.
                  </div>

                  <div className="card_text3">
                    <div className="card_text3-text">자세히 보기</div>
                    <svg
                      className="card_text3-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                    </svg>
                  </div>
                </div>
                <div className="right-card2 cardBundle">
                  <Lottie
                    animationData={main_lottie2}
                    loop
                    autoPlay
                    lottieRef={lottieRef}
                    className="main_lottie"
                  />
                  <div className="card_text1">
                    나에게 잘 맞는 사람을 찾아보세요.
                  </div>
                  <div className="card_text2">
                    open ai가 여러분에게 맞는 최적의 사용자를 찾아드립니다.
                  </div>

                  <div className="card_text3">
                    <div className="card_text3-text">자세히 보기</div>
                    <svg
                      className="card_text3-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                    </svg>
                  </div>
                </div>
                {/* <img id="img_info2" src={info1} alt="info" /> */}

                {/* <img src={info4} alt="info" /> */}
                {/* {mainData.info1.map((it: InfoItem, index: number) => {
                  return (
                    <div className="info1-content-right-box" key={index}>
                      <span className="info1-content-right-box-head">
                        {it.title}
                      </span>
                      <span className="info1-content-left-body">{it.data}</span>
                    </div>
                  );
                })} */}
              </div>
            </div>
            {/*
            <div className="info1-content-left">
              <span className="info1-content-left-body">
                여러 서비스를 통해
                <br /> 팀원 정보를 간편하게 <br /> 제공합니다
              </span>
            </div>
            <div className="info1-content-right">
              {mainData.info1.map((it: InfoItem, index: number) => {
                return (
                  <div className="info1-content-right-box" key={index}>
                    <span className="info1-content-right-box-head">
                      {it.title}
                    </span>
                    <span className="info1-content-left-body">{it.data}</span>
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
        <div className="Main-recommend">
          <motion.div
            className="Main-recommend-background"
            animate={{
              scale: [1, 1.2, 1], // 크기를 1배 -> 1.2배 -> 1배로 반복
            }}
            transition={{
              duration: 2, // 2초 동안 애니메이션
              repeat: Infinity, // 무한 반복
              repeatType: "loop", // 애니메이션 반복 방식
            }}
          ></motion.div>{" "}
          <div className="Main-recommend-recommend_title">
            이런 분들께 추천드립니다.
          </div>
          <div className="Main-recommend-boxBundle">
            <div className="recommend_box">
              아이디어는 있는데 같이 할 사람을 찾는 분
            </div>
            <div className="recommend_box">
              팀원과 마찰이 없이 프로젝트를 진행하고 싶으신 분
            </div>
            <div className="recommend_box">
              내가 만든 프로젝트를 다른 사람드에게 보여주고 싶은 분
            </div>
            <div className="recommend_box">
              협업을 통해 포트폴리오를 만들고 싶은 분
            </div>
          </div>
        </div>
        <div className="Main-feature">
          <div className="Main-feature-title">
            리밍이 제공하는 특별한 기능을 즐겨보세요
          </div>
          <div className="Main-feature-boxBundle">
            <div className="BoxWrapper"></div>
            <div className="BoxWrapper"></div>
            <div className="BoxWrapper"></div>
            <div className="BoxWrapper"></div>
            {/*채팅 화상채팅 팀원 평가 시스템 월 말 전시회*/}
          </div>
        </div>

        {/* <div className="info2">
          <div className="info2-left">
            <span className="info2-left-txt1">혼자 고민했던 문제들</span>
            <span className="info2-left-txt2">리밍으로 해결하세요</span>
          </div>

          <div className="info2-right">
            {mainData.info2.map((it: InfoItem, index: number) => {
              return (
                <div className="info2-right-box" key={index}>
                  <span className="info2-right-box-img">{it.title}</span>
                  <span className="info2-right-box-txt">{it.data}</span>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* <div className="info3">
          <div className="progressbar">
            {mainData.info3.map((_, index: number) => (
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
            {mainData.info3.map((it: InfoItem, index: number) => {
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
        </div> */}

        <footer className="footer">
          <div className="footer-title">
            <img src={logo} />
            <span>lymming</span>
          </div>
          <div className="footer-profile">
            <div className="footer-profile-box">
              <span className="footer-profile-box-span1">박준서</span>
              <span className="footer-profile-box-span2">
                빅데이터 20205175
              </span>
              <span>깃허브</span>
            </div>
            <div className="footer-profile-box">
              <span className="footer-profile-box-span1">노기훈</span>
              <span className="footer-profile-box-span2">
                빅데이터 20205160
              </span>
              <span>깃허브</span>
            </div>
            <div className="footer-profile-box">
              <span className="footer-profile-box-span1">지우림</span>
              <span className="footer-profile-box-span2">
                빅데이터 20202849
              </span>
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
    </>
  );
};

export default Main;
