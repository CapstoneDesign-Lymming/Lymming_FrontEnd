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
        `https://lymming-back.link/share/details/${projectId}/end111`
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
  const teamMemberArr = propData.teamMember.split(",");
  console.log(typeof teamMemberArr, teamMemberArr);
  const teamMemberLen = teamMemberArr.length; //멤버 수
  console.log(teamMemberLen);
  const urlBundle = propData.urlBundle?.split(",");
  const positionBundle = propData.positionBundle?.split(",");
  // const positionBundle = propData.positionBundle;
  // const urlBundle = propData.urlBundle;

  /**extract 키워드 붙은 값들이 서버에서 추출한 데이터 */
  // const extractUrl: string[] = [];
  // const extractPosition: string[] = [];

  /**서버 데이터에서 값들 추출하는 함수 */
  // const extractItems = () => {
  //   const nameArr = teamMember.slice(1, -1).split(",");
  //   nameArr.map((i) => extractName.push(i));

  //   const urlArr = urlBundle.slice(1, -1).split(",");
  //   urlArr.map((i) => extractUrl.push(i));

  //   const positionArr = positionBundle.slice(1, -1).split(",");
  //   positionArr.map((i) => extractPosition.push(i));
  // };

  // if (!teamMember) {
  //   const leader = propData.leader;
  //   console.log("propData.teamMember", teamMember);
  //   extractName.push(leader);
  // }
  // else if (!teamMember.includes(",")) {
  //   //leader한명만 들어올 경우
  //   extractName.push(teamMember);
  // } else {
  //   extractItems();
  // }
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
