import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

/**WebRTC와 관련된 요소들을 정의합니다 */
const useVideoChatting = () => {
  const { roomId } = useParams();

  const roomName = useRef<string | undefined>("test_room");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isRemoteScreenSharing, setIsRemoteScreenSharing] =
    useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isLocalScreenSharing, setIsLocalScreenSharing] =
    useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const nextSocket = io(import.meta.env.VITE_SIGNALING_SERVER_URL, {
      transports: ["websocket"], //websocket우선 사용
    });
    setSocket(nextSocket);
    roomName.current = roomId;
    console.log("화상채팅 roomId", roomId);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        {
          urls: import.meta.env.VITE_COTURN_SERVER_IP,
          username: import.meta.env.VITE_COTURN_ID,
          credential: import.meta.env.VITE_COTURN_PW,
        },
      ],
    });
    pc.oniceconnectionstatechange = () => {
      //pc내부의 이벤트 핸들러에서 이벤트에 따라 pc객체 내부의 함수를 실행
      console.log("ICE connection state: ", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
        console.log("iceconnect 연결");
      } else {
        console.log("아직 iceconnect 연결 x");
      }
    };
    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }
      console.log("ICE Candidate: ", event.candidate);
      try {
        nextSocket.emit("candidate", {
          candidate: event.candidate,
          room: roomName.current,
        });
        console.log("emit candidtate");
      } catch (error) {
        console.log("emit candidate Error!", error);
      }
    };
    pc.ontrack = (event) => {
      console.log("remoteVideoRef 1: ", remoteVideoRef);
      try {
        if (!remoteVideoRef.current || !event.streams[0]) return;
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log("remoteVideoRef 2: ", remoteVideoRef);
      } catch (error) {
        console.log("ontrack에서 발생한 ", error);
      }
    };

    try {
      peerConnection.current = pc; //기존 useState값을 useRef로 변경하여 즉시 참조할 수 있게 변경
    } catch (error) {
      console.log("setPeerConnection Error!", error);
    }

    nextSocket.on("offer", async (msg) => {
      //1.상대가 call-> 방으로 offer감->offer받음
      if (msg.sender === socket?.id) return;
      console.log("get offer");
      try {
        //2. offer받고 sdp설정
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        console.log("set sdp");
      } catch (error) {
        console.log("setRemoteDescription", error);
      }
      try {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
      } catch (error) {
        console.log("answer", error);
      }
      try {
        //3. answer 보냄
        nextSocket.emit("answer", {
          sdp: pc.localDescription,
          room: roomName.current,
        });
        console.log("emit answer");
      } catch (error) {
        console.log("emit answer", error);
      }
    });

    nextSocket.on("answer", (msg) => {
      if (msg.sender === socket?.id) return;
      try {
        const sdp = msg.sdp;
        pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer, setRemoteDescription");
      } catch (error) {
        console.log("answer에서 setRemoteDescription Error!", error);
      }
    });

    nextSocket.on("candidate", (msg) => {
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
          console.log(isCalling);
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
      console.log("all ready now");
      console.log("allReady, call호출 전 peerConnectino 상태:", peerConnection);
      setIsReady(true);
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
          console.log();
        } else {
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
  return {
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
  };
};

export default useVideoChatting;
