import Header from "../../components/header/Header";
import "./ChatPage.scss";
import chatsend from "../../assets/img/chat_send.png";
import video from "../../assets/img/videocam.png";

const ChatPage = () => {
  const currentUser = "user123"; // 토큰을 통해 로그인된 사용자 id 확인해야함
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

  return (
    <div className="ChatPage">
      <Header />

      <div className="content">
        <div className="content-left">
          <div className="content-left-title">
            <span>채팅기록</span>
          </div>
          <div className="content-left-list">
            <div className="content-left-list-item">
              <div className="content-left-list-item-profile">
                <img />
                <span>박준서</span>
              </div>
              <div className="content-left-list-item-body">
                <span className="content-left-list-item-body-message">
                  안녕하세요!
                </span>
                <span className="content-left-list-item-body-time">
                  00:31:00
                </span>
              </div>
              <div className="content-left-list-item-count">
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
        <div className="content-right">
          <div className="content-right-info">
            <div className="content-right-info-profile">
              <img />
              <span>박준서</span>
            </div>
            <button className="content-right-info-video">
              <img src={video} />
            </button>
          </div>
          <hr />
          <div className="content-right-body">
            {data.map((msg, index) => (
              <>
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
              </>
            ))}
          </div>
          <div className="content-right-input">
            <textarea />
            <button>
              <img src={chatsend} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
