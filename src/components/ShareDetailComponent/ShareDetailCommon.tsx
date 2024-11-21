import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import "./ShareDetailCommon.scss";
// import useModalStore from "../../store/useModalState";
import { useState } from "react";
// import RootModal from "../Modal/RootModal/RootModal";
import axios from "axios";
import { useToastStore } from "../../store/useToastState";
import RootToast from "../Toast/RootToast/RootToast";
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
    end: boolean;
  };
}

const ShareDetailCommon = ({ data: propData }: ShareDetailLeaderProps) => {
  const { data } = useInfoStore();
  const navigate = useNavigate();
  //TODO:
  const { isToastOpen, openToast, setSuccessText, setErrorText } =
    useToastStore();
  const [toastName, setToastName] = useState("");

  const clickEndShareProject = async (projectId: number) => {
    try {
      const response = await axios.put(
        `https://lymming-back.link/share/details/${projectId}/end`
      );
      setToastName("successToast");
      setSuccessText("프로젝트가 종료되었습니다");
      openToast();
      return response.data;
    } catch (error) {
      setToastName("errorToast");
      setErrorText("프로젝트가 종료되지 않았습니다.");
      openToast();
      console.error(error);
    }
    //TODO:종료하기 로직은 endmodal 내부에서 진행
  };
  const teamMemberArr = propData.teamMember?.split(",");
  console.log(typeof teamMemberArr, teamMemberArr);
  const teamMemberLen = teamMemberArr.length; //멤버 수/
  console.log(teamMemberLen);
  const urlBundle = propData.memberUrlBundle?.split(",");
  console.log("prop url", propData.memberUrlBundle);
  console.log("urlBundle", urlBundle);
  const positionBundle = propData.positionBundle?.split(",");

  return (
    <>
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {propData.sharePageName ||
              "아직 프로젝트 이름이 설정되지 않았습니다"}
          </div>
          <div className="ShareDetailCommon-Body">
            <img src={`${propData.sharePageUrl}`} alt="" />
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
                          src={`${urlBundle[idx]}`}
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
            <div className="leader_btn_bundle">
              <div
                className="leader_btn_put"
                onClick={() => {
                  navigate("/share/detail/leader", { state: propData });
                }}
              >
                수정하기
              </div>
              <div
                className="leader_btn_end"
                onClick={() => clickEndShareProject(propData.sharePageId)}
              >
                종료하기
              </div>
            </div>
          )}
        </div>
      </div>
      {isToastOpen && toastName === "successToast" && (
        <RootToast toastName="successToast" />
      )}
    </>
  );
};

export default ShareDetailCommon;
