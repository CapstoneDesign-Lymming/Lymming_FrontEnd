interface UserInfo {
  userId: number;
  bio: string;
  category: string;
  devStyle: string;
  favorites: number;
  gender: string;
  serverNickname: string;
  interests: string[];
  job: string;
  loginType: string;
  nickname: string;
  position: string;
  stack: string[];
  temperature: number;
  userImg: string | null;
  keyCode: string;
  uid: number | null;
  work_time: string;
  working_team: string;
  with_people: string;
}

export default UserInfo;
