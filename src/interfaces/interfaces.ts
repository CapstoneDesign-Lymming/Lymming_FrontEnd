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
export default ShareDetailLeaderProps;
