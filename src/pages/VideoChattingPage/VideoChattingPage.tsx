import {  useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./VideoChattingPage.scss"


const VideoChattingPage = () => {
    const navigate = useNavigate();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
    console.log("비디오 연결 상태",isVideoOn);
    // const [isVideoChatting,setInVideoChattng]=useState<boolean>(false);
    // const [isMicOn,setIsMicOn]=useState<boolean>(true);
    const [room, setRoom] = useState<string>('test_room'); //TODO: 추후 room id는 url에 담아서 전달하고 이를 파싱해오기
    const [socket, setSocket] = useState<Socket | null>(null);
    // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [isScreenSharing,setIsScreenSharing]=useState<boolean>(false);
    
    useEffect(() => {
        const nextSocket = io('http://localhost:8080');
        setSocket(nextSocket);
        setRoom("test_room"); //TODO: 추후 사용자 room id로 변경

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                {
                  urls: import.meta.env.VITE_COTURN_SERVER_IP,
                  username: import.meta.env.VITE_COTURN_ID,
                  credential: import.meta.env.VITE_COTURN_PW
                },
            ],
        });

        pc.onicecandidate = (event) => { //on_ice_candidate
            if (!event.candidate) return;
            console.log("# onicecandidate")
            nextSocket.emit('candidate', { candidate: event.candidate, room });
        };
        pc.ontrack = (event) => {
            if (!remoteVideoRef.current || !event.streams[0]) return;
            console.log("# ontrack");
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        try {
            // setPeerConnection(pc);
            peerConnection.current = pc; //기존 useState값을 useRef로 변경하여 즉시 참조할 수 있게 변경
            console.log("# PeerConnection")
        } catch (error) {
            console.log("setPeerConnection Error!",error);
        }
        
        nextSocket.on('offer', async (msg) => {
            if (msg.sender === socket?.id) return;
            console.log("offer받음");

            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            nextSocket.emit('answer', { sdp: pc.localDescription, room });
        });

        nextSocket.on('answer', (msg) => {
            console.log("answer");
            if (msg.sender === socket?.id) return;
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        });

        
        nextSocket.on('candidate', (msg) => {
            console.log('candidate')
            if (msg.sender === socket?.id) return;

            const candidate = msg.candidate;
            if (candidate && candidate.sdpMid !== null && candidate.sdpMLineIndex !== null) {
                try {
                    const iceCandidate = new RTCIceCandidate(candidate);
                    if(peerConnection.current && iceCandidate){
                        peerConnection.current.addIceCandidate(iceCandidate)
                        .catch((error) => {
                            console.error("Error adding received ICE candidate", error);
                        });
                    }
                    
                } catch (error) {
                    console.error("Error constructing RTCIceCandidate", error);
                }
            } else {
                console.log("Invalid ICE candidate: sdpMid or sdpMLineIndex is null");
            }
        });

        nextSocket.on('screenSharing',async (msg)=>{
          console.log("상대방 화면 공유 상태", msg.isScreenSharing);
          setIsScreenSharing(msg.isScreenSharing);

          if(!msg.isScreenSharing){
            const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if(remoteVideoRef.current){
              remoteVideoRef.current.srcObject=webcamStream;
            }
            if(peerConnection.current){
                const videoSender = peerConnection.current.getSenders().find(sender=>sender.track?.kind ==='video');
                if(videoSender) videoSender.replaceTrack(webcamStream.getVideoTracks()[0])
            }
          }
        });
        //TODO:
        //TODO: setVideo와 joinRoom에서 peerConnetion상태 확인하기 !!!
        nextSocket.on('allReady',async()=>{
            console.log("⭐모두 준비 완료");
            console.log("allReady, call호출 전 peerConnectino 상태:",peerConnection);
            const al=confirm("확인");
            if(al) call()
            
        })

        nextSocket.on('callEnded',()=>{
            console.log("callEnd")
            endCall();
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // useEffect(()=>{
    //     videoChatting();
    // })

    //TODO: setVideo + joinRoom + peerConnection => offer생성 => 연결
    // const videoChatting=()=>{
    //     try {
    //         console.log("@@")
    //         if(localVideoRef.current && peerConnection){ setVideo(); }
    //         else{ return}
    //         if (socket && room){ joinRoom(); }
    //         else{ return}

    //     } catch (error) {
    //         console.log("@@@@",error)
    //     }
        
    //     call();
    // }


    // /**비디오 버튼 클릭 시 비디오 연결, 룸 연결, 통화시작  */
     const startVideoChatting=()=>{
        setVideo();
        joinRoom();
        socket?.emit('ready');
     }



    const setVideo = async () => {
        console.log("setVideo, 비디오 세팅");
        if (!localVideoRef.current || !peerConnection) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true  });

        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }
        if(peerConnection){
            console.log("peerConnection.addTrack");
            stream.getTracks().forEach((track) => {
                if(peerConnection.current){
                    peerConnection.current.addTrack(track, stream)}});
        }
        console.log("setVideo에서 peerConnection상태",peerConnection);

        //stream: MediaStream의 객체로 비디오 및 오디오 트랙의 모음을 나타냄
        //getTracks: MediaStream객체의 메서드, 스트림에 포함된 모든 MediaStreamTrack객체를 배열형태로 변환함
        //MediaStremaTrack: 비디오나 오디오 같은 미디어 데이터의 단일 트랙을 나타냄
        setIsVideoOn(true);
    };
    // const setPeerConnection =()=>{
    //     console.log("peerConnection이 초기화되었습니다:", peerConnection);
    // }
    const joinRoom = () => {
        console.log("joinRoom 방 입성");
        console.log("joinRoom에서 peerConnection상태",peerConnection);
        if (!socket || !room) return;
        socket.emit('join', { room });
    };

    const call = async () => {
        if (!peerConnection){ 
            console.log("call 실패",peerConnection);
            return; 
        }
        console.log('🔥peerConnection상태',peerConnection);

        console.log("call");
        console.log("offer보냄");
        if(peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);//SDP세팅
            socket?.emit('offer', { sdp: offer, room });
        } //offer생성
        //offer전송
    };

    //FIXME: 화면공유 시작 클릭했지만 실패했을 경우에 대한 케이스 처리
    const screenSharing = async () => {
        if (!peerConnection) return;
        try {
          //화면공유 시작
            setIsScreenSharing(true);
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
            }
            //소켓을 활용해 화면공유 여부를 서버로 전송함 
            socket?.emit('screenSharing',{room,isScreenSharing:true});
            if(peerConnection.current){
                const videoSender = peerConnection.current.getSenders().find(sender => sender.track?.kind === 'video');
                if (videoSender) {
                    videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
                } else {
                    screenStream.getTracks().forEach((track) => {
                        if(peerConnection.current)
                        peerConnection.current.addTrack(track, screenStream)});
                }
            }
            
            console.log(isScreenSharing);
            console.log ("화면 공유 시작");

            //화면공유 종료 시
            screenStream.getVideoTracks()[0].onended = async () => {
                console.log('Screen sharing stopped');
                setIsScreenSharing(false);
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true  });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                if(peerConnection.current){
                    const webcamSender = peerConnection.current.getSenders().find(sender => sender.track?.kind === 'video');
                    if (webcamSender) {
                        webcamSender.replaceTrack(stream.getVideoTracks()[0]);
                    }
                }
                
                //화면공유 종료 상태를 서버에 알림
                socket?.emit('screenSharing',{room,isScreenSharing:false});
                setIsScreenSharing(false);
            };
        } catch (error) {
            console.error("화면 공유 오류:", error);
        }
    };
    /**비디오 연결 중단 상태*/
    const stopLocalVideo=async()=>{
         // if (!localVideoRef.current || !peerConnection) return;
         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true  });
         if(localVideoRef.current){
             localVideoRef.current.srcObject = stream;
         }
         if(peerConnection){
             stream.getTracks().forEach((track) => {
                if(peerConnection.current)
                    peerConnection.current.addTrack(track, stream)});
         }
         //stream: MediaStream의 객체로 비디오 및 오디오 트랙의 모음을 나타냄
         //getTracks: MediaStream객체의 메서드, 스트림에 포함된 모든 MediaStreamTrack객체를 배열형태로 변환함
         //MediaStremaTrack: 비디오나 오디오 같은 미디어 데이터의 단일 트랙을 나타냄
         setIsVideoOn(false);
        //  setIsMicOn(true);
    }
    const stopScreenSharing = async () => {
        if (!peerConnection) return;
        if(peerConnection.current){
            const videoSender = peerConnection.current.getSenders().find(sender => sender.track?.kind === 'video');
            if (videoSender) {
            // 현재 화면 공유 트랙을 종료하고, 웹캠 트랙으로 교체합니다.
            videoSender.replaceTrack(null);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            if (peerConnection) {
                const webcamSender = peerConnection.current.getSenders().find(sender => sender.track?.kind === 'video');
                if (webcamSender) {
                webcamSender.replaceTrack(stream.getVideoTracks()[0]);
                }
            }
            // 화면 공유 종료 상태를 서버에 알림
            socket?.emit('screenSharing', { room, isScreenSharing: false });
            setIsScreenSharing(false);
            }
        }
    };

    const endCall = ()=>{
      if(peerConnection.current){
            peerConnection.current.getSenders().forEach(sender=>{
            if(sender.track){
                sender.track.stop(); //트랙 종료
            }
            });
            peerConnection.current.close();//peer연결 종료
            peerConnection.current=null;
      }
      if(socket){
        socket.emit('callEnded',{room});
        socket.disconnect();
        setSocket(null);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;  // 비디오 요소의 소스 객체를 초기화
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;  
      }
      setIsVideoOn(false);  // 비디오 연결 상태를 초기화합니다.
      setIsScreenSharing(false);  // 화면 공유 상태를 초기화합니다.
    }
    return (
        <>
            <div className="VideoChattingWrapper">
                <div className="VideoChattingWrapper-VideoWrapper">
                    <video className={`VideoBox ${isScreenSharing?'sharing':''}`}
                        ref={localVideoRef} 
                        // isScreenSharing={isScreenSharing}/
                        autoPlay playsInline muted>
                        <svg className="VideoBox-expendIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/></svg>
                    </video>
                    <video className={`VideoBox ${isScreenSharing?'Sharing':''}`}
                        ref={remoteVideoRef} 
                        // isScreenSharing={isScreenSharing}
                        autoPlay playsInline muted>
                        <svg className="VideoBox-expendIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/></svg>
                        
                    </video>
                </div>

                <div className="VideoChattingWrapper-Navigater">

                    {<div className="NavMenu">
                        <svg className="NavMenu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/></svg>
                        <div className="NavMenu-icon_text">음소거</div>
                    </div>}

                    {!isVideoOn?
                    <div className="NavMenu" onClick={startVideoChatting}>
                        <svg className="NavMenu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                        <div>비디오</div>
                    </div>:
                    <div className="NavMenu" onClick={stopLocalVideo}>
                        <svg className="NavMenu-icon" style={{fill:"#FF4444"}}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2l0-256c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9l0 17.1 0 128 0 5.8-32-25.1L416 128c0-35.3-28.7-64-64-64L113.9 64 38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5l0 256c0 35.3 28.7 64 64 64l256 0c23.4 0 43.9-12.6 55-31.3z"/></svg>
                        <div>비디오종료</div>
                    </div>}

                    <div className="NavMenu">
                        <svg className="NavMenu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                        <div>참여자</div>
                    </div>

                    {isScreenSharing?
                        <div className="NavMenu" onClick={stopScreenSharing}>
                            <svg className="NavMenu-icon"style={{fill:"#FF4444"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM160 160c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l40 40-71 71C114 302 112 306.9 112 312s2 10 5.7 13.7l36.7 36.7c3.6 3.6 8.5 5.7 13.7 5.7s10-2 13.7-5.7l71-71 40 40c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-144c0-8.8-7.2-16-16-16l-144 0z"/></svg>
                            <div>공유중지</div>
                        </div>:
                        <div className="NavMenu" onClick={screenSharing}>
                            <svg className="NavMenu-icon" style={{fill:"#2CDE7E"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM160 160c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l40 40-71 71C114 302 112 306.9 112 312s2 10 5.7 13.7l36.7 36.7c3.6 3.6 8.5 5.7 13.7 5.7s10-2 13.7-5.7l71-71 40 40c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-144c0-8.8-7.2-16-16-16l-144 0z"/></svg>
                            <div>화면공유</div>
                        </div>
                    }
                    <div className="NavMenu" onClick={()=>{
                        endCall();
                        navigate("/");}}>
                        <svg className="NavMenu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z"/></svg>
                        <div>종료하기</div>
                    </div>
                    <div onClick={call}>start</div>
                </div>
            </div>
        </>
    )
}

export default VideoChattingPage