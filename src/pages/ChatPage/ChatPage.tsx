import Header from "../../components/header/Header";
import "./ChatPage.scss";
import chatsend from "../../assets/img/chat_send.png";
import video from "../../assets/img/videocam.png";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { pre } from "framer-motion/client";

const data2 = [
  {
    lastchat: "안녕하세요!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    lastchat: "안녕하세요!",
    userId: "user123",
    userName: "박준서",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
];

interface ChatMessage {
  content: string;
  userName: string;
  timestamp: string;
  roomId: string;
  //보낸사람
  userId: string;
}

interface chatRoom {
  id: string;
  roomId: string;
  userId: string;
  //상대
  userName: string;
}

const ChatPage = () => {
  const currentUser = "user123"; // 토큰을 통해 로그인된 사용자 id 확인해야함
  const [partner, setPartner] = useState("홍길동");
  // 채팅방 정보 받아오기 - 채팅 기록등
  const [chatRoom, setChatRoom] = useState<chatRoom | null>(null);
  const client = useRef<CompatClient | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // msg time 전달하기
  const getMsgTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    const msgTime = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    return msgTime;
  };

  // 채팅방 들어가는 함수
  // 채팅방 있는지 검사, 있으면 채팅방 있다고 상태 업데이트
  // 없으면 채팅방 생성 함수
  const enterChatRoom = async () => {
    const roomExists = await isExistChatRoom();

    if (roomExists) {
      // 소켓 연결
      connectSocket();
    } else {
      // 채팅방 생성 함수
      await createChatRoom();
      connectSocket();
    }
  };

  // 채팅방이 있는지 검사
  const isExistChatRoom = async () => {
    if (partner) {
      try {
        const res = await axios.post("http://localhost:8080/chat/existroom", {
          roomId: `${currentUser}_${partner}`,
        });
        await setChatRoom(res.data);
        console.log(res);
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const createChatRoom = async () => {
    if (partner) {
      const payload = {
        roomId: `${currentUser}_${partner}`,
        userId: partner,
      };
      try {
        const res = await axios.post(
          "http://localhost:8080/chat/room/create",
          payload
        );

        if (res.data) {
          setChatRoom(res.data);
        } else {
          console.log("채팅방이 존재하지 않습니다.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  const loadChatHistory = async () => {
    if (chatRoom?.roomId) {
      console.log("채팅기록 불러오기");
      try {
        const res = await axios.get(
          `http://localhost:8080/chat/${chatRoom.roomId}/history`
        );
        setChatHistory(res.data);

        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const connectSocket = () => {
    const socket = new SockJS("http://localhost:8080/chatting");

    client.current = Stomp.over(socket);

    client.current.connect(
      {},
      () => {
        client.current?.subscribe(
          `/sub/chat/room/${chatRoom?.id}`,
          (message) => {
            const msg = JSON.parse(message.body);

            if (chatRoom) {
              setChatHistory((prev) => [...prev, msg]);
            }
          }
        );
      },
      (error: any) => {
        console.error("STOMP connection error: ", error); // 연결 실패 시 오류 로그
      }
    );
  };

  const sendChatMessage = () => {
    if (client.current && client.current.connected) {
      const msgData = {
        type: "TALK",
        roomId: chatRoom!.roomId,
        userId: currentUser,
        content: inputMessage,
        timestamp: getMsgTime(),
        userName: currentUser,
      };

      client.current.send("/pub/chatting/message", {}, JSON.stringify(msgData));
      setChatHistory((prev) => [...prev, msgData]);
      setInputMessage("");
      console.log(inputMessage);
    }
  };

  useEffect(() => {
    const initializeChatRoom = async () => {
      await enterChatRoom(); // enterChatRoom이 완료될 때까지 대기
      console.log(chatRoom);
    };

    initializeChatRoom();

    return () => {
      client.current?.disconnect();
    };
  }, [partner]);

  useEffect(() => {
    loadChatHistory();
  }, [chatRoom]);

  return (
    <div className="ChatPage">
      <Header />

      <div className="content">
        <div className="content-left">
          <div className="content-left-title">
            <span>채팅기록</span>
          </div>
          <div className="content-left-list">
            {/* 추후에 리스트에서 이름으로 가져와야한다 */}
            {data2.map((it, index) => {
              return (
                <div
                  key={index}
                  className="content-left-list-item"
                  onClick={() => setPartner(it.userName)}
                >
                  <div className="content-left-list-item-profile">
                    <img />
                    <span>{it.userName}</span>
                  </div>
                  <div className="content-left-list-item-body">
                    <span className="content-left-list-item-body-message">
                      {it.lastchat}
                    </span>
                    <span className="content-left-list-item-body-time">
                      {it.timestamp}
                    </span>
                  </div>
                  <div className="content-left-list-item-count">
                    <span>1</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="content-right">
          <div className="content-right-info">
            <div className="content-right-info-profile">
              <img />
              <span>{partner}</span>
            </div>
            <button className="content-right-info-video">
              <img className="video" src={video} />
            </button>
          </div>
          <hr />
          <div className="content-right-body">
            {chatHistory &&
              chatHistory.map((msg, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`content-right-body-wrapper ${
                      msg.userId === currentUser
                        ? "own-message"
                        : "other-message"
                    }`}
                  >
                    <img />
                    <div className="container">
                      <div key={index} className={`message`}>
                        {msg.content}
                      </div>
                      <span className="time">08:00</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
          </div>
          <div className="content-right-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={sendChatMessage}>
              <img src={chatsend} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
