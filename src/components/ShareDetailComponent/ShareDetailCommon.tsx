import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import "./ShareDetailCommon.scss";
import useModalStore from "../../store/useModalState";
import { useState } from "react";
import RootModal from "../Modal/RootModal/RootModal";
interface ShareDetailLeaderProps {
  data: {
    userId: number;
    project_id: number;
    project_name: string;
    project_url: string;
    project_description: string;
    team_member: number[];
    team_member_name: string[];
    team_member_url: string[];
    team_member_position: string[];
    team_leader: string;
    is_completed: boolean;
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

  return (
    <>
      {/* <div>공통 페이지</div>
        <div>{leaderData.project_description}</div> */}
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {propData.project_name}
          </div>
          <div className="ShareDetailCommon-Body">
            <img src={`${propData.project_url}`} alt="" />
            <div className="Body_description">
              {propData.project_description}
            </div>
          </div>
          <div className="ShareDetailCommon-Footer">
            {propData.team_member.map((userId, idx) => (
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
          {propData && propData.team_leader === data.nickname && (
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
