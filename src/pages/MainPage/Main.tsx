import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Header from "../../components/header/Header";
import "./Main.scss";
import logo from "../../assets/img/lymming_logo.png";
import iphone from "../../assets/img/iphone.png";
import main_lottie1 from "../../assets/lottie/main-lottie1.json";
import main_lottie2 from "../../assets/lottie/main-lottie2.json";
import main_chat from "../../assets/lottie/main-chat.json";
import main_videochat from "../../assets/lottie/main-videochat.json";
import main_person from "../../assets/lottie/main-person.json";
import main_exhibition from "../../assets/lottie/main-exhibition.json";
// import InfiniteLoopSlider from "../../components/InfiniteLoopSlider/InfiniteLoopSlider";

// import data from "../../../public/json/mainData.json";
// import leftbtn from "../../assets/img/leftrrow.png";
// import rightbtn from "../../assets/img/rigntarrow.png";
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
  const navigate = useNavigate();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const chatLottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // 속도를 0.5배로 설정 (느리게)
    }
    if (chatLottieRef.current) {
      chatLottieRef.current.setSpeed(0.2); // 속도를 0.5배로 설정 (느리게)
    }
  }, []);
  // const mainData: MainData = data;
  // const [isBack, setIsBack] = useState(false);
  // const [visible, setVisible] = useState(0);
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
        <div className="Main-info">
          <div className="Main-info-content">
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
                    className="main_lottie"
                    animationData={main_lottie1}
                    loop
                    autoPlay
                    lottieRef={lottieRef}
                  />
                  <div className="card_text1">프로젝트에 참가해보세요.</div>
                  <div className="card_text2">
                    프로젝트는 물로, 스터디도 함께 실시간으로 참여할 수
                    있습니다.
                  </div>

                  <div
                    className="card_text3"
                    onClick={() => navigate("/participate")}
                  >
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

                  <div
                    className="card_text3"
                    onClick={() => navigate("/member")}
                  >
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
            className="Main-recommend-background1"
            animate={{
              scale: [1.0, 1.0, 1.0, 1.0, 1.0],
              x: [90, 90, -90, -90, 90],
              y: [-90, 90, 90, -90, -90],
            }}
            transition={{
              duration: 4, // 2초 동안 애니메이션
              repeat: Infinity, // 무한 반복
              repeatType: "loop", // 애니메이션 반복 방식
            }}
          ></motion.div>
          <motion.div
            className="Main-recommend-background2"
            animate={{
              scale: [1.0, 1.2, 1.1, 0.9, 1.0],
              x: [90, -90, -90, 90, 90],
              y: [90, 90, -90, -90, 90],
            }}
            transition={{
              duration: 4, // 2초 동안 애니메이션
              repeat: Infinity, // 무한 반복
              repeatType: "loop", // 애니메이션 반복 방식
            }}
          ></motion.div>
          <div className="Main-recommend-recommend_title">
            이런 분들께 추천드립니다.
          </div>
          <div className="Main-recommend-boxBundle">
            <div className="recommend_box">
              아이디어는 있는데 같이 할 팀원이 없어서 고민 중인 분
            </div>
            <div className="recommend_box">
              팀원과 마찰이 없이 프로젝트를 진행하고 싶으신 분
            </div>
            <div className="recommend_box">
              내가 만든 프로젝트를 다른 사람들에게 보여주고 홍보까지 하고 싶은
              분
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
            <div className="BoxWrapper">
              <div className="feature_title">1:1 채팅</div>
              <Lottie
                className="feature_lottie sizeDownLottie"
                animationData={main_chat}
                loop
                autoPlay
                lottieRef={chatLottieRef}
              />
              <div className="feature_article">
                프로젝트에 참여하기 전 팀원이 될 사람과 직접 채팅을 통해 서로를
                알아보세요.
              </div>
            </div>
            <div className="BoxWrapper">
              <div className="feature_title">화상 채팅</div>
              <Lottie
                className="feature_lottie"
                animationData={main_videochat}
                loop
                autoPlay
              />
              <div className="feature_article">
                1:1 화상채팅으로 온라인의 제약을 넘어 팀원과 소통해보세요.
              </div>
            </div>

            <div className="BoxWrapper">
              <div className="feature_title">팀원 평가 시스템</div>
              <Lottie
                className="feature_lottie sizeDownLottie"
                animationData={main_person}
                loop
                autoPlay
              />
              <div className="feature_article">
                프로젝트가 종료 후, 서로를 평가하는 시스템이 존재합니다. 이를
                통해 나에게 가장 잘 맞는 팀원을 직접 선별할 수 있어요.
              </div>
            </div>

            <div className="BoxWrapper">
              <div className="feature_title">월 말 전시회</div>
              <Lottie
                className="feature_lottie"
                animationData={main_exhibition}
                loop
                autoPlay
              />
              <div className="feature_article">
                매월 마지막 수요일, 리밍에서 best project를 선정해서 3d 메타버스
                전시관에 전시해 드립니다.
              </div>
            </div>
            {/*채팅, 화상채팅, 팀원 평가, 월 말 전시회*/}
          </div>
        </div>
        <div className="Main-projects">
          {/* 밑에는 리밍을 통해 나온 결과물들을 전시하는 페이지 */}
          {/* <InfiniteLoopSlider onHoverStop={true}>
            {
              bestItemData.map((el, idx)=> 
                <div className='Main__best-item' key={`title${idx}`}>
                  <div className='Main__best-item-img'>
                    <BlurImage src={el.imgUrl} alt='' fill priority/>
                  </div>
                  <h3 className='Main__best-item-title'>{el.title}</h3>
                  <p className='Main__best-item-desc'>{el.desc}</p>
                </div>
              )
            }
          </InfiniteLoopSlider> */}
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
          <div className="footer-logo">
            <img id="footer_logo" src={logo} alt="footer-logo" />
            <div id="footer_logotext">lymming</div>
          </div>
          <div className="footer-license">
            <span> © 2024 Hallym University Capstone Design</span>
            <span> 찾아오시는 길 | 강원특별자치도 춘천시 한림대학길 1 </span>
            <span> 문의 사항 | lymming@lymming.com </span>
          </div>
          <div className="footer-about">
            <div className="footer-about-member">
              <a
                href="https://github.com/Junseo11"
                target="_blank"
                className="github_url"
              >
                <svg
                  className="git_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
                <div className="name">박준서</div>
              </a>
            </div>
            <div className="footer-about-member">
              <a
                href="https://github.com/jiurim"
                target="_blank"
                className="github_url"
              >
                <svg
                  className="git_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
                <div className="name">지우림</div>
              </a>
            </div>
            <div className="footer-about-member">
              <a
                href="https://github.com/Nohgh"
                target="_blank"
                className="github_url"
              >
                <svg
                  className="git_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
                <div className="name">노기훈</div>
              </a>
            </div>
          </div>
        </footer>
        {/* 리밍 */}
        {/* <div className="footer-title">
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
          </div> */}
      </div>
    </>
  );
};

export default Main;
