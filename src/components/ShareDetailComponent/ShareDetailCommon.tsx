import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../../store/useLoginStore";
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
  const { username } = useLoginStore();
  const navigate = useNavigate();
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
          {data && data.team_leader === username && (
            <div className="leader_btn_bundle">
              <div
                className="leader_btn"
                onClick={() => {
                  navigate("/share/detail/leader", { state: data });
                }}
              >
                수정하기
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareDetailCommon;
