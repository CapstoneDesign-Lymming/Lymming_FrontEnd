import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import "./ShareDetailCommon.scss";
import useModalStore from "../../store/useModalState";
import { useState } from "react";
import RootModal from "../Modal/RootModal/RootModal";
interface ShareDetailLeaderProps {
  data: {
    userId: number;
    projectId: number;
    sharePageName: string;
    sharePageUrl: string;
    sharePageDescription: string;
    teamMember: string;
    team_member_name: string[]; //
    team_member_url: string[]; //
    team_member_position: string[]; //
    leader: string;
    end: boolean;
  };
}

const ShareDetailCommon = ({ data: propData }: ShareDetailLeaderProps) => {
  const { data } = useInfoStore();
  const navigate = useNavigate();
  const { isModalOpen, openModal } = useModalStore();
  const [modalName, setModalName] = useState("");

  const clickEndShareProject = () => {
    //TODO:종료하기 로직은 endmodal 내부에서 진행
    setModalName("shareEndModal");
    openModal();
  };
  // const teamMember = propData.teamMember.split;

  const teamMemberArr: string[] = [];
  if (!propData.teamMember) {
    console.log("❌❌❌❌");
    propData.teamMember = propData.leader;
    console.log("propData.teamMember", propData.teamMember);
    teamMemberArr.push(propData.teamMember);
  }
  console.log("propData", propData);
  return (
    <>
      {/* <div>공통 페이지</div>
        <div>{leaderData.project_description}</div> */}
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {propData.sharePageName ||
              "수정하기를 통해 프로젝트 이름을 설정해주세요"}
          </div>
          <div className="ShareDetailCommon-Body">
            <img src={`${propData.sharePageUrl}`} alt="" />
            <div className="Body_description">
              {propData.sharePageDescription ||
                "수정하기를 통해 프로젝트 설명을 설정해주세요"}
            </div>
          </div>
          <div className="ShareDetailCommon-Footer">
            {teamMemberArr.map((userId, idx) => (
              <div className="MemberCardWrapper">
                {
                  <div className="MemberCard" key={userId}>
                    <div className="MemberCard-head">
                      <img
                        className="MemberCard-head-profile"
                        src={`${propData.team_member_url[idx]}`}
                        alt=""
                      ></img>
                    </div>
                    <div className="MemberCard-body">
                      <div className="MemberCard-body-name">
                        {propData.team_member_name[idx]}
                      </div>
                      <div className="MemberCard-body-position">
                        {propData.team_member_position[idx]}
                      </div>
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
              <div className="leader_btn_end" onClick={clickEndShareProject}>
                종료하기
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && modalName === "shareEndModal" && (
        <RootModal modalName="shareEndModal" />
      )}
    </>
  );
};

export default ShareDetailCommon;
