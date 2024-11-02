interface ShareDetailLeaderProps{
    leaderData: {
        userId: number,
        project_id: number,
        project_name: string,
        project_url: string,
        project_description: string,
        team_member: number[],
        team_member_name: string[],
        is_completed: boolean,
      }
  }
const ShareDetailCommon = ({leaderData}:ShareDetailLeaderProps) => {
  return (
    <>  
        <div>공통 페이지</div>
        <div>{leaderData.project_description}</div>

    </>
)
}

export default ShareDetailCommon