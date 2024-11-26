import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import Header from "../../components/header/Header";
import "./ChatPage.scss";
import { useInfoStore } from "../../store/useLoginStore";
import chatsend from "../../assets/img/chat_send.png";
import chatsendDisable from "../../assets/img/chat_send_disabled.png";
// import video from "../../assets/img/videocam.png";
import noUserImg from "../../assets/img/no-profile.webp";
interface ChatMessage {
  content: string;
  userName: string;
  timestamp: string;
  roomId: string;
  //보낸사람
  userId: string;
  type: string;

  //공유페이지 추가
  inviteNickname: string;
  sharePageId: number;
}

interface chatRoom {
  id: string;
  roomId: string;
  userId1: string;
  //상대
  userId2: string;
  lastMessage: ChatMessage;
  user1Img: string;
  user2Img: string;
}

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useInfoStore();
  const currentUser = data.nickname; // 토큰을 통해 로그인된 사용자 id 확인해야함

  // 채팅방 정보 받아오기 - 채팅 기록등
  const [chatRoom, setChatRoom] = useState<chatRoom | null>(null);
  const client = useRef<CompatClient | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  // 구독상태
  const [isSubscribed, setIsSubscribed] = useState(false);
  const parterId = location.state.id;
  const invite = location.state.invite;
  const sharePageId = location.state.sharepage;
  const [partner, setPartner] = useState(parterId);
  const [chatRooms, setChatRooms] = useState<chatRoom[]>([]);
  // const [roomId, setRoomId] = useState<string>(""); roomId는 videoChatting para로 넘겨줄 때 1번 사용, setRoomId역시 roomId생서할 떄 한 번 사용-> ref로 변경
  const videoChatRoomId = useRef("");

  const [userImg, setUserImg] = useState({
    user1Img: "",
    user2Img: "",
  });
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

    if (!roomExists) {
      await createChatRoom();
    }
    getChatRooms();
  };

  // 채팅방이 있는지 검사
  const isExistChatRoom = async () => {
    if (partner) {
      const roomId = await sortChatRoomId(currentUser, partner);
      try {
        const res = await axios.post(
          "https://lymming-back.link/chat/existroom",
          {
            roomId: roomId,
          }
        );
        if (res.data === "") {
          console.log("채팅방 없음");
          return false; // 채팅방이 없으므로 false 반환
        }

        // 채팅방이 존재하는 경우
        console.log("채팅방 있음");

        setChatRoom(res.data);

        // 한 번만 상태 업데이트 후 Partner Image 설정

        return true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  };

  const createChatRoom = async () => {
    if (partner) {
      console.log("채팅방을 생성합니다");

      const roomId = await sortChatRoomId(currentUser, partner);
      // setRoomId(roomId);
      console.log("createChatRoom에서 roomId", roomId);
      videoChatRoomId.current = roomId; //비디오채팅으로 넘겨주는 roomId TODO:처음 방이 생성될 경우에 videoChatRoomId를 설정
      console.log("채팅방 아이디 생성 ", roomId);
      const payload = {
        roomId: roomId,
        userId1: currentUser,
        userId2: parterId,
      };
      try {
        const res = await axios.post(
          "https://lymming-back.link/chat/room/create",
          payload
        );

        if (res.data) {
          setChatRoom(res.data);
          console.log("생성된 채팅방의 roomid는", res.data);
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
          `https://lymming-back.link/chat/${chatRoom.roomId}/history`
        );
        setChatHistory(res.data);

        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const connectSocket = () => {
    if (client.current) {
      // 기존에 연결된 클라이언트가 있으면 연결 종료
      client.current.disconnect();
    }

    if (!chatRoom?.roomId) return;

    client.current = Stomp.over(
      () => new SockJS("https://lymming-back.link/chatting")
    );

    // STOMP 연결 설정
    client.current.connect(
      {},
      () => {
        console.log("STOMP 연결 성공");
        console.log(chatRoom.roomId);
        // 채팅방 구독
        client.current?.subscribe(
          `/sub/chat/room/${chatRoom.roomId}`,
          (message) => {
            const msg = JSON.parse(message.body);
            setChatHistory((prev) => [...prev, msg]);
          }
        );
        console.log("구독 성공");
        setIsSubscribed(true);

        if (invite === true) {
          inviteMessage();
        }
      },
      (error: any) => {
        console.error("STOMP 연결 오류:", error); // 연결 실패 시 오류 로그
        // 연결 실패 시 재연결 시도
        reconnectSocket();
      }
    );
  };

  // 재연결 시도 함수
  const reconnectSocket = () => {
    setTimeout(() => {
      console.log("자동 재연결 시도...");
      connectSocket(); // 재연결을 위한 함수 호출
    }, 5000); // 5초 후 재연결
  };

  const systemMessage = () => {
    if (client.current) {
      const msgData = {
        type: "INVITE",
        roomId: chatRoom!.roomId,
        userId: currentUser,
        content: `${currentUser}님이 프로젝트 초대를 수락하셨습니다`,
        timestamp: getMsgTime(),
        userName: currentUser,
        sharePageId: sharePageId,
        inviteNickname: parterId,
      };

      client.current.send("/pub/chatting/message", {}, JSON.stringify(msgData));

      console.log("시스템 메세지 전송");
    }
  };

  const inviteMessage = () => {
    if (client.current) {
      const msgData = {
        type: "INVITE",
        roomId: chatRoom!.roomId,
        userId: currentUser,
        content: `${currentUser}님이 ${partner}님을 프로젝트에 초대하였습니다`,
        timestamp: getMsgTime(),
        userName: currentUser,
        sharePageId: sharePageId,
        inviteNickname: parterId,
      };

      client.current.send("/pub/chatting/message", {}, JSON.stringify(msgData));

      console.log("초대 메세지 전송");

      navigate(window.location.pathname, {
        state: { id: partner, invite: false },
      });
    }
  };

  const sendChatMessage = () => {
    if (client.current && isSubscribed) {
      const msgData = {
        type: "TALK",
        roomId: chatRoom!.roomId,
        userId: currentUser,
        content: inputMessage,
        timestamp: getMsgTime(),
        userName: currentUser,
      };

      client.current.send("/pub/chatting/message", {}, JSON.stringify(msgData));

      setInputMessage("");
      console.log("전송한메세지", inputMessage);
    } else {
      console.log("메시지를 보낼 수 없습니다. 구독이 완료되지 않았습니다.");
    }
  };

  const sortChatRoomId = (userId1: string, userId2: string): string => {
    const arr = [userId1, userId2];

    arr.sort();

    return `${arr[0]}_${arr[1]}`;
  };

  // 채팅방 목록 불러오기
  const getChatRooms = async () => {
    try {
      const res = await axios.get("https://lymming-back.link/chat/chatrooms", {
        // 올바른 URL 경로 확인
        params: { userId: currentUser }, // userId를 파라미터로 전달
      });
      console.log("채팅방 목록을 불러옵니다", res.data);

      setChatRooms(
        res.data.map((room: any) => {
          const [user1, user2] = room.roomId.split("_");

          const adjustedUserId1 = user1 === currentUser ? user1 : user2;
          const adjustedUserId2 = user1 === currentUser ? user2 : user1;

          const adjustedUser1Img =
            adjustedUserId2 === currentUser ? room.user1Img : room.user2Img;
          const adjustedUser2Img: string =
            adjustedUserId2 === currentUser ? room.user2Img : room.user1Img;

          return {
            roomId: room.roomId,
            userId1: adjustedUserId1, // 로그인된 사용자를 user1로 설정
            userId2: adjustedUserId2, // 반대 사용자를 user2로 설정
            lastMessage: room.lastMessage || { content: "", timestamp: "" }, // lastMessage가 없을 경우 처리
            user1Img: adjustedUser1Img,
            user2Img: adjustedUser2Img,
          };
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const enterKeyPress = (e: React.KeyboardEvent) => {
    //FIXME: shift키와 enter를 누르면 다음 줄로 이동하게 구현
    if (e.key === "Enter" && !e.shiftKey) {
      if (inputMessage !== "") {
        console.log("enter perss!!");
        sendChatMessage();
      }
    }
  };

  // 공유페이지 초대 post
  const postInvite = async (id: number, nickname: string) => {
    try {
      const res = await axios.post(
        "https://lymming-back.link/share/add/team/member",
        {
          sharePageId: id,
          nickname: nickname,
        }
      );
      console.log("초대하기 성공", res.data);
      window.alert("채팅방초대에 수락하셨습니다");
      systemMessage();
    } catch (e) {
      window.alert("실패:이미 초대 된 방입니다");
      console.error(e);
    }
  };

  useEffect(() => {
    const initializeChatRoom = async () => {
      console.log("상대방은", partner);
      await enterChatRoom(); // enterChatRoom이 완료될 때까지 대기
    };

    initializeChatRoom();

    return () => {
      client.current?.disconnect();
    };
  }, [partner]);

  useEffect(() => {
    loadChatHistory();

    if (chatRoom?.roomId) {
      console.log("채팅방 연결 준비: ", chatRoom.roomId);

      const adjustedUser1Img =
        chatRoom.userId1 === currentUser
          ? chatRoom.user1Img
          : chatRoom.user2Img;

      const adjustedUser2Img =
        chatRoom.userId1 === currentUser
          ? chatRoom.user2Img
          : chatRoom.user1Img;

      console.log("사용자 이미지", adjustedUser1Img, adjustedUser2Img);
      setUserImg({
        user1Img: adjustedUser1Img,
        user2Img: adjustedUser2Img,
      });

      // 기존 소켓 연결 해제 (필요할 경우)
      if (client.current) {
        client.current.disconnect(() => {
          console.log("이전 소켓 연결 해제 완료");
        });
      }

      // 새로운 소켓 연결 및 구독 설정
      connectSocket();

      // videoChatRoomId 업데이트
      videoChatRoomId.current = chatRoom.roomId;
      console.log(
        "채팅방 연결 준비:👍videoChatRoomId",
        videoChatRoomId.current
      );
    }

    // 정리(clean-up) 함수: 이전 소켓 연결 해제
    return () => {
      console.log("이미지", userImg);

      if (client.current) {
        client.current.disconnect(() => {
          console.log("소켓 연결 해제 (chatRoom 변경 시)");
        });
      }
    };
  }, [chatRoom]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chatHistory]);

  return (
    <div className="ChatPage">
      <Header />

      <div className="content">
        <div className="content-left">
          <div className="content-left-title">
            <span>채팅기록</span>
          </div>
          <div className="content-left-list">
            {chatRooms &&
              chatRooms.map((it, index) => {
                console.log(it.userId1, currentUser, it.user1Img, it.user2Img);
                return (
                  <div
                    key={index}
                    className="content-left-list-item"
                    onClick={() => setPartner(it.userId2)}
                  >
                    <div className="content-left-list-item-profile">
                      <img src={it.user2Img || noUserImg} />
                      <span>{it.userId2}</span>
                    </div>
                    <div className="content-left-list-item-body">
                      <span className="content-left-list-item-body-message">
                        {it.lastMessage ? it.lastMessage.content : ""}
                      </span>
                      <span className="content-left-list-item-body-time">
                        {it.lastMessage ? it.lastMessage.timestamp : ""}
                      </span>
                    </div>
                    <div className="content-left-list-item-count">
                      {/* <span>1</span> */}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {partner ? (
          <div className="content-right">
            <div className="content-right-info">
              <div className="content-right-info-profile">
                <img src={userImg.user2Img ? userImg.user2Img : noUserImg} />
                <span>{partner}</span>
              </div>
              <svg
                className="content-right-info-video"
                onClick={() => {
                  console.log("🌳roomId", videoChatRoomId.current);
                  navigate(`/videochat/${videoChatRoomId.current}`);
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
              </svg>
            </div>
            <hr />
            <div className="content-right-body">
              {chatHistory &&
                chatHistory.map((msg, index) => (
                  <React.Fragment key={index}>
                    {msg.type === "TALK" ? (
                      <div
                        className={`content-right-body-wrapper ${
                          msg.userId === currentUser
                            ? "own-message"
                            : "other-message"
                        }`}
                      >
                        <img
                          src={
                            msg.userId === currentUser
                              ? userImg.user1Img || noUserImg
                              : userImg.user2Img || noUserImg
                          }
                        />

                        <div className="container">
                          <div key={index} className={`message`}>
                            {msg.content}
                          </div>
                          <span className="time">{msg.timestamp}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="invite">
                        <div className="invite-message">{msg.content}</div>
                        <div
                          className="invite-buttons"
                          style={{
                            display:
                              currentUser === msg.inviteNickname
                                ? "flex"
                                : "none",
                          }}
                        >
                          <button
                            className="invite-buttons-accept"
                            onClick={() =>
                              postInvite(msg.sharePageId, msg.inviteNickname)
                            }
                          >
                            수락
                          </button>
                          <button className="invite-buttons-denined">
                            거절
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

              <div ref={messageEndRef}></div>
            </div>
            <div className="content-right-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={enterKeyPress}
              />
              <button
                onClick={sendChatMessage}
                style={{ pointerEvents: inputMessage === "" ? "none" : "all" }}
              >
                <img src={inputMessage === "" ? chatsendDisable : chatsend} />
              </button>
            </div>
          </div>
        ) : (
          <div className="no_user">채팅방을 선택해주세요</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
