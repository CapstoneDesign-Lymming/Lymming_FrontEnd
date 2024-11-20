export interface ParticipateItem {
  userId: number;
  projectId: number;
  studyType: string;
  projectName: string;
  deadline: string;
  uploadTime: string;
  recruitmentField: string;
  workType: string;
  nickname: string;
  techStack: string;
  skillicon: string[];
  studyMethod: string;
  projectDuration: string;
  recruitmentCount: number;
  viewCount: number;
  teamMember: number;
  description: string;
  //게시물 좋아요
  likes: boolean;
}
