import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import "./ShareDetailCommon.scss";
// import useModalStore from "../../store/useModalState";
import { useEffect, useRef, useState } from "react";
// import RootModal from "../Modal/RootModal/RootModal";
import axios from "axios";
import { useToastStore } from "../../store/useToastState";
import RootToast from "../Toast/RootToast/RootToast";
import useModalStore from "../../store/useModalState";
import RootModal from "../Modal/RootModal/RootModal";
import { useInvoteStore } from "../../store/useInvoteStore";
import defalutImg from "../../assets/img/noimage.jpg";
interface ShareDetailLeaderProps {
  data: {
    sharePageId: number;
    userId: number;
    projectId: number;
    projectLink: string;
    sharePageName: string;
    sharePageUrl: string;
    sharePageDescription: string;
    teamMember: string;
    memberUrlBundle: string; // 멤버의 이미지 번들
    positionBundle: string; //멤버의 포지션 번들
    team_name: string;
    leader: string;
    end: string;
  };
}

const ShareDetailCommon = ({ data: propData }: ShareDetailLeaderProps) => {
  const { data } = useInfoStore();
  console.log(data.nickname);
  const navigate = useNavigate();
  //TODO:
  const { isToastOpen, openToast, setSuccessText, setErrorText } =
    useToastStore();
  const { isModalOpen, openModal } = useModalStore();
  const {
    setCandidates,
    setCandidatesUrl,
    setCandidatesPosition,
    setNickName,
    setSharePageId,
    resetInvoteState,
  } = useInvoteStore();
  const [toastName, setToastName] = useState("");
  const [modalName, setModalName] = useState("");

  let teamMemberArr = propData.teamMember?.split(","); //멤버 세팅
  console.log("propData.teamMember", propData.teamMember);
  const teamMemberLen = useRef(0);
  teamMemberLen.current = teamMemberArr.length; //멤버 수/
  console.log("teamMemberArrs", teamMemberArr);

  let urlBundle = propData.memberUrlBundle?.split(","); //멤버 url세팅
  let positionBundle = propData.positionBundle?.split(","); //멤버 포지션 세팅
  const myInx = teamMemberArr.indexOf(data.nickname); // 나의 idx를 파악
  console.log("내 인덱스", myInx);
  const copyTeamMemberArr = [...teamMemberArr]; //멤버 카피
  const copyUrlBundle = [...urlBundle]; //url 카피
  const copyPositionBundle = [...positionBundle]; //position 카피
  teamMemberArr.splice(myInx, 1); //평가모달로 넘기기위한 나를제외 시킨 멤버 배열
  const invoteMembers = [...teamMemberArr];
  console.log("splice이후 teamMemberArr", teamMemberArr);
  teamMemberArr = [...copyTeamMemberArr]; //원본 배열 손상으로 인해 카피 배열을 가져옴

  urlBundle.splice(myInx, 1);
  const invoteUrl = [...urlBundle];
  urlBundle = [...copyUrlBundle];

  positionBundle.splice(myInx, 1);
  const invotePosition = [...positionBundle];
  positionBundle = [...copyPositionBundle];

  const clickEndShareProject = async (projectId: number) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_ENDPOINT
        }/share/details/${projectId}/end`
      );
      setToastName("successToast");
      setSuccessText("프로젝트가 종료되었습니다");
      setCandidates(invoteMembers);
      setCandidatesUrl(invoteUrl);
      setCandidatesPosition(invotePosition);
      setNickName(data.nickname);
      setSharePageId(propData.sharePageId);
      setModalName("voteModal");
      openModal();
      openToast();
      return response.data;
    } catch (error) {
      setToastName("errorToast");
      setErrorText("프로젝트가 종료되지 않았습니다.");
      openToast();
      console.error(error);
    }
  };
  /**평가 받을 멤버를 담을 배열을 전달하는 함수  */
  // const selectInvoteMember = () => {
  //   const newArr = teamMemberArr.filter((item) => item !== data.nickname);
  //   return newArr;
  // };

  const checkVote = async (): Promise<boolean> => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/vote/has/user?sharePageId=${
          propData.sharePageId
        }&nickname=${data.nickname}`
      );
      if (res.data === "TRUE") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const isVote = await checkVote(); // Promise를 처리

      if (!isVote && propData.end === "TRUE") {
        //FIXME: end가 TRUE일 경우에만 투표모달 표시
        setCandidates(invoteMembers);
        setCandidatesUrl(invoteUrl);
        setCandidatesPosition(invotePosition);
        setNickName(data.nickname);
        setSharePageId(propData.sharePageId);
        setModalName("voteModal");
        openModal();
      }
    };
    fetchVoteStatus(); // 비동기 함수 호출
    /**
     * 1. 투표를 했는지 get을 통해 가져온다
     * 2. 투표 안했으면 모달을 연다
     * 모달로 투표받을 사람들 및 투표주소를 주스텐드 값으로 넘겨준다 (이름 포지션 url)
     * 모달에서 주스탠드로  받은 투표받을 사람들을 나열하고 투표를 받는다
     * 투표를 한다
     */
  }, []);
  useEffect(() => {
    return () => {
      resetInvoteState();
    };
  }, []);
  return (
    <>
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {propData.sharePageName ||
              "아직 프로젝트 이름이 설정되지 않았습니다"}
          </div>
          <div className="ShareDetailCommon-Body">
            <img
              src={propData.sharePageUrl ? propData.sharePageUrl : defalutImg}
              alt=""
            />
            {propData.projectLink && (
              <a
                className="project_link"
                href={`${propData.projectLink}`}
                target="_blank"
              >
                <div className="link">{propData.projectLink}</div>
              </a>
            )}
            <div className="Body_description">
              {propData.sharePageDescription ||
                "아직 프로젝트 설명이 설정되지 않았습니다"}
            </div>
          </div>
          <div className="ShareDetailCommon-Footer">
            {teamMemberArr.map((userId, idx) => (
              <div className="MemberCardWrapper" key={idx}>
                {
                  <div className="MemberCard">
                    <div className="MemberCard-head">
                      {propData.memberUrlBundle && (
                        <img
                          className="MemberCard-head-profile"
                          src={urlBundle[idx] || defalutImg}
                          alt=""
                        ></img>
                      )}
                    </div>
                    <div className="MemberCard-body">
                      <div className="MemberCard-body-name">{userId}</div>
                      {propData.positionBundle && (
                        <div className="MemberCard-body-position">
                          {positionBundle[idx]}
                        </div>
                      )}
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
          {propData && propData.leader === data.nickname && (
            <div
              className={`leader_btn_bundle ${
                propData.end === "TRUE" ? "endProject" : ""
              }`}
            >
              <div
                className="leader_btn_put"
                onClick={() => {
                  navigate("/share/detail/leader", { state: propData });
                }}
              >
                수정하기
              </div>
              {propData.end === "FALSE" && (
                <div
                  className="leader_btn_end"
                  onClick={() => clickEndShareProject(propData.sharePageId)}
                >
                  종료하기
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isToastOpen && toastName === "successToast" && (
        <RootToast toastName="successToast" />
      )}
      {isModalOpen && modalName === "voteModal" && (
        <RootModal modalName="voteModal" />
      )}
    </>
  );
};

export default ShareDetailCommon;
