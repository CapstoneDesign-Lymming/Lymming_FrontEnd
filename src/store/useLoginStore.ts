import { create } from "zustand";

interface LoginState {
  login: boolean;
  count: number;
  isOpen: boolean;
  username:string;
  setCount: () => void;
  setCountDown: () => void;
  setIsOpen: () => void;
  setLogin: () => void;
  setUserName: (newUsername: string) => void; 
}

interface UserInfo {
  name: string;
  gender: string;
  job: string;
  category: string;
  skills: string[];
  interest: string[];
  time: string;
  introduce: string;
}

interface InfoState {
  data: UserInfo;
  setData: (newData: Partial<UserInfo>) => void;
}

// 로그인 data
export const useLoginStore = create<LoginState>((set) => ({
  login: true,
  // login: false,
  count: 1,
  isOpen: false,
  username:"노기훈",
  setCount: () => set((state: any) => ({ count: state.count + 1 })),
  setCountDown: () => set((state: any) => ({ count: state.count - 1 })),
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
  setLogin: () => set((state: any) => ({ login: !state.login })),
  setUserName: (newUsername: string) => set(() => ({ username: newUsername })),
}));

// 회원 정보 입력 data
export const useInfoStore = create<InfoState>((set) => ({
  data: {
    name: "",
    gender: "",
    job: "",
    category: "",
    skills: [],
    interest: [],
    time: "",
    introduce: "",
  },

  setData: (newData: any) =>
    set((state: any) => ({ data: { ...state.data, ...newData } })),
}));
