import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../store/useModalState";
import useConfirmVideoStore from "../../store/useComfirmVideoStore";
import RootModal from "../../components/Modal/RootModal/RootModal";
import "./VideoChattingPage.scss";
import useVideoChatting from "../../hooks/useVideoChatting";
const VideoChattingPage = () => {
  const navigate = useNavigate();

  const {
    isRemoteScreenSharing,
    isLocalScreenSharing,
    isVideoOn,
    isReady,
    peerConnection,
    isCalling,
    socket,
    roomName,
    localVideoRef,
    remoteVideoRef,
    setIsLocalScreenSharing,
    setIsVideoOn,
    setIsCalling,
    setSocket,
  } = useVideoChatting();
  const { isModalOpen, openModal } = useModalStore();

  //전역 상태 관리
  const { isConfirmVideo } = useConfirmVideoStore();

  useEffect(() => {
    if (!isConfirmVideo) {
      openModal();
    }
    if (isConfirmVideo) startVideoChatting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmVideo]);

  const startVideoChatting = () => {
    console.log("startVideoChatting");
    setVideo();
    joinRoom();
    socket?.emit("ready");
  };

  const setVideo = async () => {
    console.log("setVideo, 비디오 세팅");
    if (!localVideoRef.current || !peerConnection) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    if (peerConnection) {
      console.log("peerConnection.addTrack");
      stream.getTracks().forEach((track) => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });
    }
    console.log("setVideo에서 peerConnection상태", peerConnection);

    setIsVideoOn(true);
  };

  const joinRoom = () => {
    console.log("joinRoom 방 입성");
    console.log("joinRoom에서 peerConnection상태", peerConnection);
    if (!socket || !roomName.current) return;
    socket.emit("join", { room: roomName.current });
  };

  const call = async () => {
    if (!peerConnection) {
      console.log("call 실패", peerConnection);
      return;
    }
    console.log("🔥peerConnection상태", peerConnection);

    console.log("call");
    console.log("offer보냄");
    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer); //SDP세팅
      socket?.emit("offer", { sdp: offer, room: roomName.current });
    } //offer생성
    //offer전송
    console.log("🌦️");
    setIsCalling(true);
  };

  const screenSharing = async () => {
    if (!peerConnection) return;
    try {
      //화면공유 시작
      setIsLocalScreenSharing(true);
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      //소켓을 활용해 화면공유 여부를 서버로 전송함
      socket?.emit("screenSharing", {
        room: roomName.current,
        isScreenSharing: true,
      });
      if (peerConnection.current) {
        const videoSender = peerConnection.current
          .getSenders()
          .find((sender) => sender.track?.kind === "video");
        if (videoSender) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        } else {
          screenStream.getTracks().forEach((track) => {
            if (peerConnection.current)
              peerConnection.current.addTrack(track, screenStream);
          });
        }
      }

      console.log(isLocalScreenSharing);
      console.log("화면 공유 시작");

      //화면공유 종료 시
      screenStream.getVideoTracks()[0].onended = async () => {
        console.log("Screen sharing stopped");
        setIsLocalScreenSharing(false);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (peerConnection.current) {
          const webcamSender = peerConnection.current
            .getSenders()
            .find((sender) => sender.track?.kind === "video");
          if (webcamSender) {
            webcamSender.replaceTrack(stream.getVideoTracks()[0]);
          }
        }

        //화면공유 종료 상태를 서버에 알림
        socket?.emit("screenSharing", {
          room: roomName.current,
          isScreenSharing: false,
        });
        setIsLocalScreenSharing(false);
      };
    } catch (error) {
      console.error("화면 공유 오류:", error);
    }
  };

  const stopScreenSharing = async () => {
    if (!peerConnection) return;
    if (peerConnection.current) {
      const videoSender = peerConnection.current
        .getSenders()
        .find((sender) => sender.track?.kind === "video");
      if (videoSender) {
        // 현재 화면 공유 트랙을 종료하고, 웹캠 트랙으로 교체합니다.
        videoSender.replaceTrack(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (peerConnection) {
          const webcamSender = peerConnection.current
            .getSenders()
            .find((sender) => sender.track?.kind === "video");
          if (webcamSender) {
            webcamSender.replaceTrack(stream.getVideoTracks()[0]);
          }
        }
        // 화면 공유 종료 상태를 서버에 알림
        socket?.emit("screenSharing", {
          room: roomName.current,
          isScreenSharing: false,
        });
        setIsLocalScreenSharing(false);
      }
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop(); //트랙 종료
        }
      });
      peerConnection.current.close(); //peer연결 종료
      peerConnection.current = null;
    }
    if (socket) {
      socket.emit("callEnded", { room: roomName });
      socket.disconnect();
      setSocket(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null; // 비디오 요소의 소스 객체를 초기화
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsVideoOn(false); // 비디오 연결 상태를 초기화합니다.
    setIsLocalScreenSharing(false); // 화면 공유 상태를 초기화합니다.
    setIsCalling(false);
  };

  const toggleVideo = async () => {
    if (isVideoOn) {
      // 비디오 끄기
      const tracks = (
        localVideoRef.current?.srcObject as MediaStream
      )?.getVideoTracks();
      tracks?.forEach((track: MediaStreamTrack) => track.stop()); // 모든 비디오 트랙 중지
      setIsVideoOn(false);
      //소켓으로 toggleVideo값 전송
      socket?.emit("toggleVideo", {
        room: roomName.current,
        userId: socket.id,
        isVideoOn: false,
      });
      console.log("toggleVideo off");
    } else {
      // 비디오 켜기
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream; // 비디오 재설정
        console.log("비디오 재설정", stream);
      }
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });
      setIsVideoOn(true);
      socket?.emit("toggleVideo", {
        room: roomName.current,
        userId: socket.id,
        isVideoOn: true,
      });
      console.log("toggleVideo on");
    }
  };

  return (
    <>
      <div className="VideoChattingWrapper">
        <div className="VideoChattingWrapper-VideoWrapper">
          <video
            className={`VideoBox ${isLocalScreenSharing ? "Sharing" : ""}`}
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          >
            <svg
              className="VideoBox-expendIcon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z" />
            </svg>
          </video>
          <video
            className={`VideoBox ${isRemoteScreenSharing ? "Sharing" : ""}`}
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
          >
            <svg
              className="VideoBox-expendIcon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z" />
            </svg>
          </video>
        </div>
        <div className="VideoChattingWrapper-Navigater">
          {isVideoOn ? (
            <div className="NavMenu" onClick={toggleVideo}>
              <svg
                className="NavMenu-icon"
                style={{ fill: "#FF4444" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2l0-256c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9l0 17.1 0 128 0 5.8-32-25.1L416 128c0-35.3-28.7-64-64-64L113.9 64 38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5l0 256c0 35.3 28.7 64 64 64l256 0c23.4 0 43.9-12.6 55-31.3z" />
              </svg>
              <div>비디오 끄기</div>
            </div>
          ) : (
            <div className="NavMenu" onClick={toggleVideo}>
              <svg
                className="NavMenu-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
              </svg>
              <div>비디오 켜기</div>
            </div>
          )}
          {isLocalScreenSharing ? (
            <div className="NavMenu" onClick={stopScreenSharing}>
              <svg
                className="NavMenu-icon"
                style={{ fill: "#FF4444" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM160 160c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l40 40-71 71C114 302 112 306.9 112 312s2 10 5.7 13.7l36.7 36.7c3.6 3.6 8.5 5.7 13.7 5.7s10-2 13.7-5.7l71-71 40 40c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-144c0-8.8-7.2-16-16-16l-144 0z" />
              </svg>
              <div>공유중지</div>
            </div>
          ) : (
            <div className="NavMenu" onClick={screenSharing}>
              <svg
                className="NavMenu-icon"
                style={{ fill: "#2CDE7E" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM160 160c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l40 40-71 71C114 302 112 306.9 112 312s2 10 5.7 13.7l36.7 36.7c3.6 3.6 8.5 5.7 13.7 5.7s10-2 13.7-5.7l71-71 40 40c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-144c0-8.8-7.2-16-16-16l-144 0z" />
              </svg>
              <div>화면공유</div>
            </div>
          )}
          <div
            className="NavMenu"
            onClick={() => {
              endCall();
              navigate("/");
            }}
          >
            <svg
              className="NavMenu-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z" />
            </svg>
            <div>종료하기</div>
          </div>
          {isReady && !isCalling && (
            <div className="NavMenu" onClick={call}>
              <svg
                className="NavMenu-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
              <div>통화하기</div>
            </div>
          )}

          {isCalling && (
            <div className="NavMenu" onClick={endCall}>
              <svg
                className="NavMenu-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z" />
              </svg>
              <div>통화종료</div>
            </div>
          )}
        </div>
        {isModalOpen && <RootModal modalName="confirmVideoModal" />}
      </div>
    </>
  );
};

export default VideoChattingPage;
