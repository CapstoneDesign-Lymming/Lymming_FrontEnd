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

const ShareDetailLeader = ({ data }: ShareDetailLeaderProps) => {
  console.log(data);
  return (
    <>
      <div className="ShareDetailLeaderWrapper">
        <div className="ShareDetailLeader">
          <div className="ShareDetailLeader-InputBox__Bunddle">
            <div className="InputBox_NameBundle">
              <div>
                <div>팀 이름 </div>
                <input></input>
              </div>
              <div>
                <div>프로젝트 이름</div>
                <input></input>
              </div>
            </div>
            <div className="InputBox_linkBundle">
              <div>프로젝트 링크</div>
              <input></input>
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
            <button>종료하기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareDetailLeader;
