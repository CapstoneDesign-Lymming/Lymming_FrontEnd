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
    urlBundle: string; // 멤버의 이미지 번들
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
  const urlBundle = propData.urlBundle?.split(",");
  const positionBundle = propData.positionBundle?.split(",");

  return (
    <>
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {propData.sharePageName ||
              "아직 프로젝트 이름이 설정되지 않았습니다"}
            {/* {propData.projectLink && (
           
            )} */}
          </div>
          {/* <div>
            <div>프로젝트 링크</div>
            <div>{propData.projectLink}</div>
          </div> */}
          <div className="ShareDetailCommon-Body">
            <img src={`${propData.sharePageUrl}`} alt="" />
            {propData.projectLink && (
              <a
                className="project_link"
                href={`${propData.projectLink}`}
                target="_blank"
              >
                <div className="link">
                  {/* <svg
                    className="link_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                  </svg> */}
                  {propData.projectLink}
                </div>
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
                      {propData.urlBundle && (
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
