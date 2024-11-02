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

const ShareDetailLeader = ({leaderData}:ShareDetailLeaderProps) => {
    return (
        <div>{leaderData.project_description}</div>
    )
}

export default ShareDetailLeader