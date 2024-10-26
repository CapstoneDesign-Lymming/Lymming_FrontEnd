import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const NewVideoChattingPage = () => {
    const socketRef = useRef<Socket>();
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection>();
    const roomName="testRoom";
    
    const getMedia=async()=>{
        try {
            //미디어 생성
            const stream=await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            });

            if(myVideoRef.current) myVideoRef.current.srcObject=stream; //내 미디어에 stream추가
            if(!(pcRef.current && socketRef.current)) return;

            stream.getTracks().forEach((track)=>{
                if(!pcRef.current) return;
                pcRef.current.addTrack(track,stream); 
            });

            //peerConnection에 onicecandidate 후보 등록 
            pcRef.current.onicecandidate=(e)=>{//(parameter) e: RTCPeerConnectionIceEvent
                if(e.candidate){
                    if(!socketRef.current)return;
                }
                console.log("recv cnadidate");
                if(socketRef.current){
                    socketRef.current.emit("candidate",e.candidate,roomName);}
            }
            pcRef.current.ontrack=(e)=>{
                if(remoteVideoRef.current){
                    remoteVideoRef.current.srcObject=e.streams[0]; //remoteVideo세팅
                }
            };
        } catch (error) {
            console.log(error);
        }
    };

    /**sdp생성, localDescription에 sdp 추가, offer emit전송 */
    const createOffer =async()=>{ //offer 생성시 비동기 처리
        console.log('create Offer');
        if(!(pcRef.current && socketRef.current))return; // peerConnection, socket의 현재 값이 존재하지 않다면 return
        
        try {
            //lim.dim.ts내부의 creatoffer정의> createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;

            const sdp = await pcRef.current.createOffer(); //sdp에 offer생성
            pcRef.current.setLocalDescription(sdp); //peerConnection의 값 중 localDescription항목에 sdp추가
            console.log("sent the offer"); 
            socketRef.current.emit("offer", sdp, roomName); //offer메세지를 통해 생성한 sdp와 roomName을 전송(emit)
        } catch (error) {
            console.log(error);
        }
    };

    /**offer를 받고(sdp) Answer를 회신 */
    const createAnswer = async (sdp:RTCSessionDescription)=>{
        console.log("createAnswer");
        if (!(pcRef.current && socketRef.current)) return;
        try {
            pcRef.current.setRemoteDescription(sdp); //원격RemoteDescription의 sdp를 peerConnection에 정의
            const answerSdp = await pcRef.current.createAnswer(); //pcRef의 createAnswer를 통해 Answer생성, answerSdp에 할당
            pcRef.current.setLocalDescription(answerSdp); //pcRef의 localDescription에 answerSdp 정의

            console.log('sent the answer');
            socketRef.current.emit("answer",answerSdp,roomName); //asnwer메세지를 통해 answerSdp와 roomName을 전송
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(()=>{
        socketRef.current=io('http://localhost:8080');
        pcRef.current = new RTCPeerConnection({
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

        //user가 존재하는 경우 createOffer
        socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
            if (allUsers.length > 0) {
              createOffer(); //offer생성, sdp전송
            }
          });  

        //getOffer를 통해 offer를 수신할 경우, 전달받은 sdp를 통해 createAnswer
        socketRef.current.on("getOffer", (sdp: RTCSessionDescription) => {
            console.log("recv Offer");
            createAnswer(sdp);
        });
        
        //Answer을 받음, 여기서 sdp는 answerSdp
        socketRef.current.on("getAnswer", (sdp: RTCSessionDescription) => {
        console.log("recv Answer");
        if (!pcRef.current) {
            return;
        }
        //받은 sdp를 통해 RemoteDescription 설정
        pcRef.current.setRemoteDescription(sdp);
        });   

        //candidate받음, peerconnection에 iceCandidate 추가 
        socketRef.current.on("getCandidate", async (candidate: RTCIceCandidate) => {
            if (!pcRef.current) {
              return;
            }
            await pcRef.current.addIceCandidate(candidate);
        });
        
        //join_room메세지 전달 
        socketRef.current.emit("join_room", {
            room: roomName,
        });
      
        getMedia();

        return () => {
            if (socketRef.current) {
              socketRef.current.disconnect();
            }
            if (pcRef.current) {
              pcRef.current.close();
            }
        };
    });


    return (
        <div>
            <video
                id="remotevideo"
                style={{
                    width: 240,
                    height: 240,
                    backgroundColor: "black",
                }}
                ref={myVideoRef}
                autoPlay
            />
            <video
                id="remotevideo"
                style={{
                    width: 240,
                    height: 240,
                    backgroundColor: "black",
                }}
                ref={remoteVideoRef}
                autoPlay
            />
      </div>
    )
}

export default NewVideoChattingPage