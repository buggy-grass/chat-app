import { io, Socket } from "socket.io-client";
import ServerManager from "../server/ServerManager";
import ServerListActions from "../../store/actions/ServerListActions";
import SocketConnectionActions from "../../store/actions/SocketConnectionActions";
import UserActions from "../../store/actions/UserActions";

class UserSocketManager {
  static socket: Socket;
  static localStream: MediaStream;
  static peerConnection: RTCPeerConnection;
  static config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  static async connect() {
    SocketConnectionActions.connection(1);

    UserSocketManager.socket = io("http://localhost:3000", {
      auth: { userId: "bugra.cimen" },
    });

    UserSocketManager.socket.on("connect", () => {
      SocketConnectionActions.connection(2);
    });

    UserSocketManager.socket.on("disconnect", () => {
      
    });

    UserSocketManager.socket.on("connect_error", (error) => {
      SocketConnectionActions.connection(0);
    });
  }

  static async startStream() {
    UserSocketManager.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    UserSocketManager.peerConnection = new RTCPeerConnection(UserSocketManager.config);

    // Yerel akışı peerConnection'a ekle
    UserSocketManager.localStream.getTracks().forEach((track) => {
      UserSocketManager.peerConnection.addTrack(
        track,
        UserSocketManager.localStream
      );
    });

    // ICE adaylarını gönder
    UserSocketManager.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        UserSocketManager.socket.emit("sendSignal", {
          signal: { candidate: event.candidate },
          target: "bugra.cimen", // hedef kullanıcı ID'si
        });
      }
    };

    // Diğer kullanıcıdan gelen medya akışını oynatma
    UserSocketManager.peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      const audioElement = document.createElement("audio");
      audioElement.srcObject = remoteStream;
      audioElement.play();
    };
  }

  static joinRoom(serverId:string ,roomId: string) {
    const user = UserActions.getUser();
    UserSocketManager.socket.emit('join-room', {user: user.username, nickname:user.nickname, serverId: serverId , roomId: roomId});
  }

  static leaveRoom(serverId:string ,roomId: string) {
    const user = UserActions.getUser();
    UserSocketManager.socket.emit('leave-room', {user: user.username, serverId: serverId , roomId: roomId});
  }

  static async createOffer() {
    const offer = await UserSocketManager.peerConnection.createOffer();
    await UserSocketManager.peerConnection.setLocalDescription(offer);
    UserSocketManager.socket.emit('sendSignal', {
      signal: { sdp: offer },
      target: 'targetUserId',
    });
  }

  static async createAnswer(signal: any) {
    await UserSocketManager.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    const answer = await UserSocketManager.peerConnection.createAnswer();
    await UserSocketManager.peerConnection.setLocalDescription(answer);
    UserSocketManager.socket.emit('sendSignal', {
      signal: { sdp: answer },
      target: 'targetUserId',
    });
  }

  static async listen(){
    UserSocketManager.socket.on('receiveData', async(data)=>{
      switch (data.type) {
        case "connected":
          ServerListActions.update(data.serverlist);
          break;
        case "leaved":
          let server1 = await ServerManager.list();
          console.error(server1)
          ServerListActions.update(server1);
          break;
        case "joined":
          let servers = await ServerManager.list();
          ServerListActions.update(servers);
          break;
      
        default:
          break;
      }
    })

    UserSocketManager.socket.on('receiveSignal', async (data) => {
        const { signal, sender } = data;
      
        if (signal.sdp) {
          // Teklif mi yoksa yanıt mı kontrol et
          if (signal.sdp.type === 'offer') {
            await UserSocketManager.createAnswer(signal);
          } else {
            await UserSocketManager.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          }
        } else if (signal.candidate) {
          await UserSocketManager.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      });
  }
}

export default UserSocketManager;
