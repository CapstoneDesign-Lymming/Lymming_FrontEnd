import { useLocation } from "react-router-dom";
import useModalStore from "../../store/useModalState";
import ShareInviteModal from "../Modal/SharepageModal/ShareInviteModal/ShareInviteModal";
import { useEffect, useState } from "react";
import Header from "../header/Header";
import "./ShareDetailLeader.scss";
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
//TODO: 공통 페이지에서 리더라면 수정하기 표시가 뜸

//수정하기 누르면 지금 리더페이지로 이동
const ShareDetailLeader = () => {
  const location = useLocation();
  const data: ShareDetailLeaderProps = location.state;
  const { isModalOpen } = useModalStore();
  const [modalName, setModalName] = useState("");
  /**임시로 설정한 모달 이름  */
  useEffect(() => {
    setModalName("ShareInvite");
  });

  console.log(data);
  return (
    <>
      <Header />
      <div className="ShareDetailLeaderWrapper">
        <div className="ShareDetailLeader">
          <div className="ShareDetailLeader-InputBox__Bunddle">
            <div className="InputBox_NameBundle">
              <div className="teamNameWrapper">
                <div className="nameText">팀 이름 </div>
                <input className="nameInput"></input>
              </div>
              <div className="projectNameWrapper">
                <div className="nameText">프로젝트 이름</div>
                <input className="nameInput"></input>
              </div>
            </div>
            <div className="InputBox_linkBundle">
              <div>프로젝트 링크</div>
              <input className="InputBox_linkBundle-inputBox"></input>
            </div>
            <div className="InputBox_descriptionBuncle">
              <div>프로젝트 설명</div>
              <input></input>
            </div>
          </div>
          <div className="ShareDetailLeader-AddImage_Bundle">
            <div>프로젝트 사진</div>
            <div></div>
          </div>
          <div className="ShareDetailLeader-Members_Bundle">
            <div>참여 인원</div>
            <div></div>
          </div>
          <div className="ShareDetailLeader-Footer_BtnWrapper">
            <button>저장하기</button>
          </div>
        </div>
        {isModalOpen && modalName === "ShareInvite" && <ShareInviteModal />}
      </div>
    </>
  );
};

export default ShareDetailLeader;
