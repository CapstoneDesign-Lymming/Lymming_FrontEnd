import Header from "../../components/header/Header";
import "./CollectPage.scss";
import ParticipateBoard from "../../components/ParticipateBoard/ParticipateBoard";
import { useCallback, useEffect, useState } from "react";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import { ParticipateItem } from "../../interfaces/participate";
import axios from "axios";
import { useInfoStore } from "../../store/useLoginStore";

const CollectPage = () => {
  const [list, setList] = useState<ParticipateItem[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalData, setUserModalData] = useState({
    userId: 0,
    nickname: "",
  });
  const [selectTab, setSelectTab] = useState("내가쓴글");
  const { data } = useInfoStore();
  useEffect(() => {
    //setList(dummy.dummy as ParticipateItem[]);
  }, []);

  const getLikeBoard = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://lymming-back.link/favorites/list/${data.userId}`
      );
      setList(res.data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getWirteBoard = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://lymming-back.link/list/project/${data.userId}`
      );
      setList(res.data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (selectTab === "내가쓴글") {
      getWirteBoard();
      return;
    } else if (selectTab === "내가찜한글") {
      getLikeBoard();
      return;
    }
  }, [selectTab]);

  return (
    <div className="CollectPage">
      <Header />

      <div className="tab">
        <span
          className={selectTab === "내가쓴글" ? "active" : ""}
          onClick={() => setSelectTab("내가쓴글")}
        >
          내가 쓴 글
        </span>
        <span
          className={selectTab === "내가찜한글" ? "active" : ""}
          onClick={() => setSelectTab("내가찜한글")}
        >
          내가 찜한 글
        </span>
      </div>
      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal
            close={setUserModalOpen}
            userId={userModalData.userId}
            nickname={userModalData.nickname}
          />
        </>
      )}
      <div className="content">
        {list.map((it, index) => {
          return (
            <ParticipateBoard
              item={it}
              key={index}
              index={index}
              setUserModalData={setUserModalData}
              setUserModalOpen={setUserModalOpen}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CollectPage;
