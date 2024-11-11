import { create } from "zustand";

interface LoginState {
  login: boolean;
  count: number;
  isOpen: boolean;
  isExist: boolean;

  setCount: () => void;
  setCountDown: () => void;
  setIsOpen: () => void;
  setLogin: () => void;
  setIsExist: () => void;
}

interface UserInfo {
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
  refreshToken: string;
  stack: string[];
  temperature: number;
  userImg: string | null;
  keyCode: string;
  uid: number | null;
  work_time: string;
  working_team: string;
  with_people: string;
}

interface InfoState {
  data: UserInfo;
  setData: (newData: Partial<UserInfo>) => void;
}

// 로그인 data
export const useLoginStore = create<LoginState>((set) => ({
  login: false,
  count: 1,
  isOpen: false,
  //닉네임 중복체크
  isExist: false,
  setCount: () => set((state: any) => ({ count: state.count + 1 })),
  setCountDown: () => set((state: any) => ({ count: state.count - 1 })),
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
  setLogin: () => set((state: any) => ({ login: !state.login })),
  setIsExist: () => set((state: any) => ({ isExist: !state.isExist })),
}));

// 회원 정보 입력 data
export const useInfoStore = create<InfoState>((set) => ({
  data: {
    bio: "",
    category: "",
    favorites: 0,
    gender: "",
    serverNickname: "",
    interests: [],
    job: "",
    loginType: "",

    nickname: "",

    position: "",
    refreshToken: "",
    stack: [],
    temperature: 0,
    userImg: "",
    keyCode: "",
    uid: 0,
    // 작업 잘되는 시간
    work_time: "",
    // 팀원과 작업할때
    working_team: "",
    // 작업할때 선호하는 방식
    devStyle: "",
    // 사람들과 함께 있을때
    with_people: "",
  },

  setData: (newData: Partial<UserInfo>) =>
    set((state) => {
      console.log("Updating data with:", newData);
      return { data: { ...state.data, ...newData } };
    }),
}));
