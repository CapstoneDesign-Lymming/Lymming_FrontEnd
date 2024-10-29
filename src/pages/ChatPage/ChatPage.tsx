import Header from "../../components/header/Header";
import "./ChatPage.scss";
import chatsend from "../../assets/img/chat_send.png";
import video from "../../assets/img/videocam.png";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

const data = [
  {
    content: "안녕하세요!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "안녕하세요 ㅎㅎ",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "넵 혹시 팀원 구하시나요?",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "네네 저희 백엔드 구하고 있습니다",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },

  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },

  {
    content: "좋아요!!",
    userId: "user123",
    userName: "홍길동",
    timestamp: "2024-07-29T14:30:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
  {
    content: "오예",
    userId: "user456",
    userName: "김철수",
    timestamp: "2024-07-29T14:31:00Z",
    roomId: "room1",
  },
];

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
}

interface chatRoom {
  id: string;
  chatHistory: ChatMessage[];
}

const ChatPage = () => {
  const currentUser = "user123"; // 토큰을 통해 로그인된 사용자 id 확인해야함
  const [partner, setPartner] = useState("");
  // 채팅방 정보 받아오기 - 채팅 기록등
  const [chatRoom, setChatRoom] = useState<chatRoom | null>(null);
  const client = useRef<CompatClient | null>(null);
  const [inputMessage, setInputMessage] = useState("");

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
    await isExistChatRoom();
    if (chatRoom) {
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
        const res = await axios.post(
          "http://localhost:8080/chat/existroom",
          `${currentUser}_${partner}`
        );
        setChatRoom(res.data);
        console.log(res);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const createChatRoom = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/chat/room/create",
        `${currentUser}_${partner}`
      );

      setChatRoom(res.data);
      console.log("채팅방 생성", res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const connectSocket = () => {
    const socket = new SockJS("http://localhost:8080/chatting");
    client.current = Stomp.over(socket);

    client.current.connect({}, () => {
      client.current?.subscribe(`/sub/chat/room/${chatRoom?.id}`, (message) => {
        const msg = JSON.parse(message.body);
        console.log("받은 메세지", msg);
        if (chatRoom) {
          setChatRoom((prev) => ({
            ...prev!,
            chatHistory: [...prev!.chatHistory, msg],
          }));
        }
      });
    });
  };

  const sendChatMessage = () => {
    if (client.current && client.current.connected) {
      client.current.send(
        "/pub/chatting/message",
        {},
        JSON.stringify({
          type: "TALK",
          roomId: chatRoom?.id,
          content: inputMessage,
          timestamp: getMsgTime(),
          userName: currentUser,
        })
      );
      setInputMessage("");
      console.log(inputMessage);
    }
  };

  // useEffect(() => {
  //   setPartner("park");
  // }, []);

  useEffect(() => {
    enterChatRoom();

    return () => {
      client.current?.disconnect();
    };
  }, [partner]);

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
              <span>박준서</span>
            </div>
            <button className="content-right-info-video">
              <img className="video" src={video} />
            </button>
          </div>
          <hr />
          <div className="content-right-body">
            {data.map((msg, index) => (
              <React.Fragment key={index}>
                <div
                  className={`content-right-body-wrapper ${
                    msg.userId === currentUser ? "own-message" : "other-message"
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
            <textarea onChange={(e) => setInputMessage(e.target.value)} />
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
