import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./VideoChattingPage.scss";
// import ComfirmVideoModal from "../../components/Modal/VideoChattingModal/ComfirmVideoModal";
import useModalStore from "../../store/useModalState";
import useConfirmVideoStore from "../../store/useComfirmVideoStore";
import RootModal from "../../components/Modal/RootModal/RootModal";

/**TODO:
 * 완료 1. 최초 렌더링 시 비디오 활성화 물어보는 방식으로 변경 (기존: 비디오 아이콘 선택)
 * 1. node.js 배포
 * 2. 마이크 비디오 on off
 * 3. 프로필 사진 video화면에 표시
 * 4. 참여자 목록
 * 5. 추후 채팅방->화상채팅방 이동시 url에 room id값 받아서 room name세팅
 *
 * FIXME:
 * 1. 화면공유 시작 클릭했지만 실패했을 경우에 대한 케이스 처리
 * 2. 비디오 off후 on시 상대에게 정상작동 x
 */
const VideoChattingPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  console.log("para", roomId);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState(true);

  // const [isVideoChatting,setInVideoChattng]=useState<boolean>(false);
  // const [isMicOn,setIsMicOn]=useState<boolean>(true);
  const [room, setRoom] = useState<string>("test_room"); //TODO: 추후 room id는 url에 담아서 전달하고 이를 파싱해오기
  const [socket, setSocket] = useState<Socket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isLocalScreenSharing, setIsLocalScreenSharing] =
    useState<boolean>(false);
  const [isRemoteScreenSharing, setIsRemoteScreenSharing] =
    useState<boolean>(false);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);

  const { isModalOpen, openModal } = useModalStore();
  const { isConfirmVideo } = useConfirmVideoStore();

  // const [isVideoOn,setIsVideoOn]=useState(true);

  useEffect(() => {
    //signaling server url 변경
    const nextSocket = io(import.meta.env.VITE_SIGNALING_SERVER_URL);
    setSocket(nextSocket);
    setRoom(roomId ?? "test_room"); //TODO: 추후 사용자 room id로 변경
    console.log("화상채팅 roomId", roomId);

    const turnUrl = import.meta.env.VITE_COTURN_SERVER_IP;
    const turnUsername = import.meta.env.VITE_COTURN_ID;
    const turnCredential = import.meta.env.VITE_COTURN_PW;
    console.log("turn정보", turnUrl, turnUsername, turnCredential);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        {
          urls: turnUrl,
          username: turnUsername,
          credential: turnCredential,
        },
      ],
    });

    pc.onicecandidate = (event) => {
      //on_ice_candidate
      if (!event.candidate) return;
      console.log("# onicecandidate");
      console.log("💧💧");
      nextSocket.emit("candidate", { candidate: event.candidate, room });
    };
    pc.ontrack = (event) => {
      if (!remoteVideoRef.current || !event.streams[0]) return;
      console.log("# ontrack");
      //dddd
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    try {
      // setPeerConnection(pc);
      peerConnection.current = pc; //기존 useState값을 useRef로 변경하여 즉시 참조할 수 있게 변경
      console.log("# PeerConnection");
    } catch (error) {
      console.log("setPeerConnection Error!", error);
    }

    nextSocket.on("offer", async (msg) => {
      if (msg.sender === socket?.id) return;
      console.log("offer받음");

      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      nextSocket.emit("answer", { sdp: pc.localDescription, room });
    });

    nextSocket.on("answer", (msg) => {
      console.log("answer");
      if (msg.sender === socket?.id) return;
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    });

    nextSocket.on("candidate", (msg) => {
      console.log("candidate");
      if (msg.sender === socket?.id) return;

      const candidate = msg.candidate;
      if (
        candidate &&
        candidate.sdpMid !== null &&
        candidate.sdpMLineIndex !== null
      ) {
        try {
          const iceCandidate = new RTCIceCandidate(candidate);
          if (peerConnection.current && iceCandidate) {
            peerConnection.current
              .addIceCandidate(iceCandidate)
              .catch((error) => {
                console.error("Error adding received ICE candidate", error);
              });
          }
          setIsCalling(true);
          console.log("🔥🔥");
        } catch (error) {
          console.error("Error constructing RTCIceCandidate", error);
        }
      } else {
        console.log("Invalid ICE candidate: sdpMid or sdpMLineIndex is null");
      }
    });

    nextSocket.on("screenSharing", async (msg) => {
      console.log("상대방 화면 공유 상태", msg.isScreenSharing);
      setIsRemoteScreenSharing(msg.isScreenSharing);
      console.log(isLocalScreenSharing);

      if (!msg.isScreenSharing) {
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = webcamStream;
        }
        if (peerConnection.current) {
          const videoSender = peerConnection.current
            .getSenders()
            .find((sender) => sender.track?.kind === "video");
          if (videoSender)
            videoSender.replaceTrack(webcamStream.getVideoTracks()[0]);
        }
      }
    });

    nextSocket.on("allReady", async () => {
      console.log("⭐모두 준비 완료");
      console.log("allReady, call호출 전 peerConnectino 상태:", peerConnection);
      setIsReady(true);
      //TODO: 토스트를 통해 사용자에게 통하하기 버튼 안내
    });

    nextSocket.on("callEnded", () => {
      console.log("callEnd");
      endCall();
    });

    nextSocket.on("toggleMic", (data) => {
      const { userId, isMicOn } = data;
      const audioTracks = (
        localVideoRef.current?.srcObject as MediaStream
      )?.getAudioTracks();
      audioTracks?.forEach((track) => {
        track.enabled = isMicOn; // 상대방의 마이크 상태에 따라 오디오 트랙 활성화/비활성화
        console.log(`User ${userId} mic status: ${isMicOn}`);
      });
    });

    nextSocket.on("toggleVideo", (data) => {
      if (data.userId !== socket?.id) {
        // 자신의 토글 무시
        if (data.isVideoOn && remoteVideoRef.current) {
          // if(peerConnection.current){
          //     peerConnection.current.ontrack=(event)=>{
          //         const [remoteStream]=event.streams;
          //         if(remoteVideoRef.current){
          //             remoteVideoRef.current.srcObject = remoteStream;
          //             console.log("상대 비디오 재설정",remoteStream);
          //         }
          //     }
          // }
        } else {
          // 상대 비디오 끄기
          // if(remoteVideoRef.current) remoteVideoRef.current.srcObject = null; // 비디오 끄기
          if (remoteVideoRef.current?.srcObject) {
            const mediaStream = remoteVideoRef.current.srcObject as MediaStream; // 타입 단언
            const tracks = mediaStream.getVideoTracks();
            tracks.forEach((track) => (track.enabled = false)); // 비디오 트랙 비활성화
            console.log("상대 비디오 끄기");
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("isConfirmVideo", isConfirmVideo);
    if (!isConfirmVideo) {
      openModal();
    }
    if (isConfirmVideo) startVideoChatting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmVideo]);

  useEffect(() => {
    setRoom(roomId ?? "test_room"); //TODO: 추후 사용자 room id로 변경
    console.log("roomId", roomId);
  }, [roomId]);
  // /**비디오 버튼 클릭 시 비디오 연결, 룸 연결, 통화시작  */
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

    //stream: MediaStream의 객체로 비디오 및 오디오 트랙의 모음을 나타냄
    //getTracks: MediaStream객체의 메서드, 스트림에 포함된 모든 MediaStreamTrack객체를 배열형태로 변환함
    //MediaStremaTrack: 비디오나 오디오 같은 미디어 데이터의 단일 트랙을 나타냄
    setIsVideoOn(true);
  };

  const joinRoom = () => {
    console.log("joinRoom 방 입성");
    console.log("joinRoom에서 peerConnection상태", peerConnection);
    if (!socket || !room) return;
    socket.emit("join", { room });
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
      socket?.emit("offer", { sdp: offer, room });
    } //offer생성
    //offer전송
    console.log("🌦️");
    setIsCalling(true);
  };

  //FIXME: 화면공유 시작 클릭했지만 실패했을 경우에 대한 케이스 처리
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
      socket?.emit("screenSharing", { room, isScreenSharing: true });
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
        socket?.emit("screenSharing", { room, isScreenSharing: false });
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
        socket?.emit("screenSharing", { room, isScreenSharing: false });
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
      socket.emit("callEnded", { room });
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
        room: room,
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
        room: room,
        userId: socket.id,
        isVideoOn: true,
      });
      console.log("toggleVideo on");
    }
  };

  const toggleMic = async () => {
    if (isMicOn) {
      // 마이크 끄기
      const tracks = (
        localVideoRef.current?.srcObject as MediaStream
      )?.getAudioTracks();
      tracks?.forEach((track: MediaStreamTrack) => track.stop()); // 모든 오디오 트랙 중지
      setIsMicOn(false);
      socket?.emit("toggleMic", {
        room: room,
        userId: socket.id,
        isMicOn: false,
      });
      console.log("🔨toggleMic off");
    } else {
      // 마이크 켜기
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream; // 오디오 재설정
      }
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });
      setIsMicOn(true);
      socket?.emit("toggleMic", {
        room: room,
        userId: socket.id,
        isMicOn: true,
      });
      console.log("🔨toggleMic on");
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
          {isMicOn ? (
            <div className="NavMenu" onClick={toggleMic}>
              <svg
                className="NavMenu-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z" />
              </svg>
              <div className="NavMenu-icon_text">음소거</div>
            </div>
          ) : (
            <div className="NavMenu" onClick={toggleMic}>
              <svg
                className="NavMenu-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z" />
              </svg>
              <div className="NavMenu-icon_text">마이크</div>
            </div>
          )}

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

          <div className="NavMenu">
            <svg
              className="NavMenu-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
            </svg>
            <div>참여자</div>
          </div>

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
