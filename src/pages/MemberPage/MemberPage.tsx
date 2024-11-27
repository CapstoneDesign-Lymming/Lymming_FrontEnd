import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RootModal from "../../components/Modal/RootModal/RootModal";
import Header from "../../components/header/Header";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import RootToast from "../../components/Toast/RootToast/RootToast";
import { useInfoStore, useLoginStore } from "../../store/useLoginStore";
import useMemberProjectStore from "../../store/useMemberProjectStore";
import useModalStore from "../../store/useModalState";
import { useToastStore } from "../../store/useToastState";
import "./MemberPage.scss";
import skills from "../../data/skills.json";
import no_profile from "../../assets/img/no-profile.webp";
import lymming from "../../assets/img/lymming_logo.png";

interface RecommendType {
  bio: string;
  deadlines: string[];
  devStyle: string[];
  job: string;
  nickname: string;
  position: string;
  projectNames: string[];
  stack: string[];
  temperature: number;
  userId: number;
  userImg: string;
}

interface memberType {
  userId: number;
  nickname: string;
  job: string;
  position: string;
  userImg: string;
  stack: string[];
  devStyle: string[];
  temperature: number;
  projectId: string;
  projectNames: string[];
  deadlines: string[];
}

const MemberPage = () => {
  const navigate = useNavigate();
  const { data: userData } = useInfoStore();
  const nickname = userData.nickname;
  const { login } = useLoginStore();
  const { isModalOpen, openModal } = useModalStore();
  const { isToastOpen, openToast, setErrorText } = useToastStore();
  const { setNickName, setProjectNames, setDeadlines } =
    useMemberProjectStore();
  const [modalName, setModalName] = useState("");
  const [toastName, setToastName] = useState("");
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [stackFilter, setStackFilter] = useState<string | null>(null);
  const [flippedRecommendIdx, setFlippedRecommendIdx] = useState<number | null>(
    null
  );
  const [flippedMemberdIdx, setFlippedMemberIdx] = useState<number | null>(
    null
  );

  const fetchRecommendData = async () => {
    if (login) {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/member/random/list/${
          userData.userId
        }`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/member/random/list/2`
      );
      return response.data;
    }
  };

  const fetchMember = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_ENDPOINT}/member/list`
    );
    return response.data;
  };
  const handleClickRecommend = (index: number) => {
    setFlippedRecommendIdx(index === flippedRecommendIdx ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };
  const handleClickMember = (index: number) => {
    setFlippedMemberIdx(index === flippedMemberdIdx ? null : index); // 이미 뒤집힌 카드 클릭시 원상복귀
  };
  const handleChatClick = (e: React.MouseEvent, nickname: string) => {
    if (!login) return; //login이 안되어있다면 return
    e.stopPropagation();

    if (nickname !== userData.nickname) {
      navigate("/chat", { state: { id: nickname } });
    }
  };
  const handleProjectClick = (
    e: React.MouseEvent,
    nickname: string,
    projectNames: string[],
    deadlines: string[]
  ) => {
    if (!login) {
      openToast();
      setToastName("errorToast");
      setErrorText("로그인 후 이용해 주세요");
      return;
    }
    e.stopPropagation();

    //TODO: 모달에 넘길 닉네임, 프로젝트이름, 데드라인
    setNickName(nickname);
    setProjectNames(projectNames);
    setDeadlines(deadlines);

    //-------
    setModalName("memberPageModal");
    openModal();
  };

  const {
    data: recommendQuery,
    error: recommendError,
    isLoading: recommendLoading,
  } = useQuery("recommendData", fetchRecommendData, {
    staleTime: 1000 * 60 * 5,
  });
  const {
    data: memberQuery,
    error: memberError,
    isLoading: memberLoading,
  } = useQuery("memberData", fetchMember, {
    staleTime: 1000 * 60 * 5,
  });

  const filteredMembers = memberQuery?.filter((member: memberType) => {
    const matchesPosition = positionFilter
      ? member.position === positionFilter
      : true;

    const memberStackArr = member.stack[0]
      ? member.stack[0]
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim())
      : [];

    const matchesStack = stackFilter
      ? memberStackArr.some((stackItem) =>
          stackItem.toLowerCase().includes(stackFilter.toLowerCase())
        )
      : true;

    return matchesPosition && matchesStack;
  });

  if (recommendLoading || memberLoading)
    return (
      <>
        <Header />
        <Loading />;
      </>
    );

  if (recommendError || memberError) return;
  <Error />;

  return (
    <>
      <Header />
      <div className="MemberWrapper">
        <div className="Member">
          {
            <div
              className={`Member-header ${
                login ? "" : "notLogin_MemberHeader"
              }`}
            >
              <div className="Member-header-text">
                {nickname}님께 어울리는 사람을 추천해드립니다.
              </div>

              <div className="Member-header-recommend">
                {recommendQuery.map((item: RecommendType, index: number) => (
                  <div
                    key={index}
                    className={`recommendCard ${
                      flippedRecommendIdx === index ? "recommendFlipped" : ""
                    }`}
                    onClick={() => handleClickRecommend(index)}
                  >
                    <div className="front">
                      <div className="recommend_name">{item.nickname}</div>
                      <div className="recommend_position">{item.position}</div>
                      <img src={`${item.userImg}`} alt="recommend" />
                    </div>
                    <div className="back">
                      <div className="recommend_name">{item.nickname}</div>
                      <div className="recommend_position">{item.position}</div>
                      <div className="back_body">
                        <div className="back_body-devStyle">
                          #{item.devStyle}
                        </div>
                        <div className="back_body-skillWrapper">
                          주요스킬 | {...item.stack}
                        </div>
                        <div
                          className="back_body-detail"
                          onClick={(e) =>
                            handleProjectClick(
                              e,
                              item.nickname,
                              item.projectNames,
                              item.deadlines
                            )
                          }
                        >
                          프로젝트 보기
                        </div>
                      </div>
                      <div
                        className="back_footerWrapper"
                        onClick={(e) => handleChatClick(e, item.nickname)}
                      >
                        <div className="back_footer">채팅하기</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* {recommendQuery.map((item, idx) => (
                <div key={idx}>{item.nickname}</div>
              ))} */}
              </div>
            </div>
          }
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
          <div className="filterWrapper">
            <div className="filter">
              <label id="position"> 포지션</label>
              <select
                onChange={(e) => setPositionFilter(e.target.value)}
                value={positionFilter || ""}
              >
                <option value="">전체</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="백엔드">백엔드</option>
                <option value="풀스택">풀스택</option>
                <option value="AI개발">AI개발</option>
                <option value="모바일 개발">모바일 개발</option>
                <option value="클라우드">클라우드</option>
                <option value="보안">보안</option>
                <option value="블록체인">블록체인</option>
                <option value="게임 개발">게임 개발</option>
                <option value="AR/VR">AR/VR</option>
                <option value="UI/UX 디자인">UI/UX 디자인</option>
                <option value="IoT">IoT</option>
                <option value="네트워크">네트워크</option>
                <option value="데이터베이스">데이터베이스</option>
                <option value="빅데이터">빅데이터</option>
              </select>
            </div>

            <div className="filter">
              <label>스킬 스택</label>
              <select
                onChange={(e) => setStackFilter(e.target.value)}
                value={stackFilter || ""}
              >
                <option value="">전체</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="javascript">javascript</option>
                <option value="Python">Python</option>
                <option value="Spring">Spring</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Swift">Swift</option>
                <option value="PHP">PHP</option>
                <option value="TypeScript">TypeScript</option>
                <option value="SQL">SQL</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="R">R</option>
                <option value="Nest.js">Nest.js</option>
                <option value="Next.js">Next.js</option>
                <option value="Figma">Figma</option>
                <option value="DJango">DJango</option>
                <option value="Dart">Dart</option>
                <option value="Tensorflow">Tensorflow</option>
              </select>
            </div>
          </div>
          <div className="Member-body">
            {filteredMembers.map((item: memberType, index: number) => (
              <div
                className={`CardWrapper ${
                  flippedMemberdIdx === index ? "memberflipped" : ""
                }`}
                key={index}
                onClick={() => handleClickMember(index)}
              >
                <div className="bodyCard_frontWrapper">
                  <div className="bodyCard_front">
                    <div className="top">
                      <div className="nickname">
                        {item.nickname || "리밍이"}
                      </div>
                      <div className="position">
                        {item.position || "SW Engineer"}
                      </div>
                    </div>
                    <div className="body">
                      <img src={item.userImg || no_profile} alt="" />
                    </div>
                    <div className="foot">
                      <svg
                        className="chatIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                        onClick={(e) => handleChatClick(e, item.nickname)}
                      >
                        <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.8 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bodyCard_backWrapper">
                  <div className="bodyCard_back">
                    <div className="bodyCard_back-head">
                      <div className="nickname">
                        {item.nickname || "리밍이"}
                      </div>
                      <div className="teamperature">
                        {item.temperature || 36.5}°C
                      </div>
                    </div>
                    <div className="bodyCard_back-bodyWrapper">
                      <div className="body">
                        <div className="devStyle">
                          {item.devStyle[0] !== "" &&
                            item.devStyle.length > 0 &&
                            item.devStyle.map((item, idx) => (
                              <div key={idx}>#{item}</div>
                            ))}
                        </div>
                        <div className="stackWrapper">
                          {item.stack.map((skill, index) => {
                            const arr = String(skill);
                            const result = arr
                              .replace(/[[\],]/g, "") // 대괄호와 쉼표를 제거
                              .split(/\s+/); // 공백을 기준으로 나누어 배열로 만들기
                            return (
                              <div key={index} className="stackWrapper-skill">
                                {result.map((skilL2, index2) => {
                                  const matchedSkill = skills.skills.find(
                                    (s) =>
                                      s.name.toUpperCase() ===
                                      skilL2.toUpperCase()
                                  );
                                  return (
                                    <div
                                      className="stackWrapper-skill-icons"
                                      key={index2}
                                    >
                                      {matchedSkill && (
                                        <img
                                          src={matchedSkill.url}
                                          alt={skilL2}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="bodyCard_back-footWrapper">
                      <div className="foot">
                        <div
                          className="project"
                          onClick={(e) =>
                            handleProjectClick(
                              e,
                              item.nickname,
                              item.projectNames,
                              item.deadlines
                            )
                          }
                        >
                          프로젝트 보기
                        </div>
                        <img className="foot-img" src={lymming} />
                        <div className="foot-text">lymming</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && modalName === "memberPageModal" && (
        <RootModal modalName="memberPageModal" />
      )}
      {isToastOpen && toastName === "errorToast" && (
        <RootToast toastName="errorToast" />
      )}
    </>
  );
};

export default MemberPage;
