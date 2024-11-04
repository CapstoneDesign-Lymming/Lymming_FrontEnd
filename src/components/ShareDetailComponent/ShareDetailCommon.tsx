import "./ShareDetailCommon.scss";
interface ShareDetailLeaderProps {
  leaderData: {
    userId: number;
    project_id: number;
    project_name: string;
    project_url: string;
    project_description: string;
    team_member: number[];
    team_member_name: string[];
    team_member_url: string[];
    team_member_position: string[];
    is_completed: boolean;
  };
}

const ShareDetailCommon = ({ leaderData }: ShareDetailLeaderProps) => {
  return (
    <>
      {/* <div>공통 페이지</div>
        <div>{leaderData.project_description}</div> */}
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">
            {leaderData.project_name}
          </div>
          <div className="ShareDetailCommon-Body">
            <img src={`${leaderData.project_url}`} alt="" />
            <div className="Body_description">
              {leaderData.project_description}
            </div>
          </div>
          <div className="ShareDetailCommon-Footer">
            {leaderData.team_member.map((userId, idx) => (
              <div className="MemberCardWrapper">
                <div className="MemberCard" key={userId}>
                  <div className="MemberCard-head">
                    <img
                      className="MemberCard-head-profile"
                      src={`${leaderData.team_member_url[idx]}`}
                      alt=""
                    ></img>
                  </div>
                  <div className="MemberCard-body">
                    <div className="MemberCard-body-name">
                      {leaderData.team_member_name[idx]}
                    </div>
                    <div className="MemberCard-body-position">
                      {leaderData.team_member_position[idx]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareDetailCommon;
