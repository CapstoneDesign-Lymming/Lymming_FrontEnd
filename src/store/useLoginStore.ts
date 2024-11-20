import { create } from "zustand";
import UserInfo from "../interfaces/user";
import { persist } from "zustand/middleware";
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

interface InfoState {
  data: UserInfo;
  setData: (newData: Partial<UserInfo>) => void;
}

// 로그인 data
export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      login: false,
      count: 1,
      isOpen: true,
      //닉네임 중복체크
      isExist: false,
      setCount: () => set((state: any) => ({ count: state.count + 1 })),
      setCountDown: () => set((state: any) => ({ count: state.count - 1 })),
      setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
      setLogin: () => set((state: any) => ({ login: !state.login })),
      setIsExist: () => set((state: any) => ({ isExist: !state.isExist })),
    }),
    {
      name: "loginState", // 로컬 스토리지에 저장될 키 이름
    }
  )
);

// 회원 정보 입력 data
export const useInfoStore = create<InfoState>()(
  persist(
    (set) => ({
      data: {
        userId: 0,
        bio: "",
        favorites: 0,
        gender: "",
        serverNickname: "",
        job: "",
        loginType: "",
        nickname: "",
        position: "",
        stack: "",
        temperature: 0,
        userImg: "",
        keyCode: "",
        uid: 0,
        work_time: "",
        working_team: "",
        devStyle: "",
        with_people: "",
        developerType: 0,
      },

      setData: (newData: Partial<UserInfo>) =>
        set((state) => {
          console.log("Updating data with:", newData);
          return { data: { ...state.data, ...newData } };
        }),
    }),
    {
      name: "userData", // 로컬 스토리지에 저장될 키 이름
    }
  )
);
