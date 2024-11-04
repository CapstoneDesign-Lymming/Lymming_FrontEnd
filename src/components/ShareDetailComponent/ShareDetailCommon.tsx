import "./ShareDetailCommon.scss";
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

const ShareDetailCommon = ({ data }: ShareDetailLeaderProps) => {
  return (
    <>
      {/* <div>공통 페이지</div>
        <div>{leaderData.project_description}</div> */}
      <div className="ShareDetailCommonWrapper">
        <div className="ShareDetailCommon">
          <div className="ShareDetailCommon-Header">{data.project_name}</div>
          <div className="ShareDetailCommon-Body">
            <img src={`${data.project_url}`} alt="" />
            <div className="Body_description">{data.project_description}</div>
          </div>
          <div className="ShareDetailCommon-Footer">
            {data.team_member.map((userId, idx) => (
              <div className="MemberCardWrapper">
                {
                  <div className="MemberCard" key={userId}>
                    <div className="MemberCard-head">
                      <img
                        className="MemberCard-head-profile"
                        src={`${data.team_member_url[idx]}`}
                        alt=""
                      ></img>
                    </div>
                    <div className="MemberCard-body">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          className={`${
                            data.team_leader === data.team_member_name[idx]
                              ? "leader"
                              : "no_leader"
                          }`}
                          d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"
                        />
                      </svg>
                      <div className="MemberCard-body-name">
                        {data.team_member_name[idx]}
                      </div>
                      <div className="MemberCard-body-position">
                        {data.team_member_position[idx]}
                      </div>
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareDetailCommon;
