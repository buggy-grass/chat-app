import RequestManager from "../RequestManager";
import { AppConfig } from "../../config/AppConfig";
class ServerManager {
  static async list(): Promise<any> {
    try {
      const config = {
        url: `${AppConfig.api}/server/serverlist`,
        method: "GET",
      };
      const result = await RequestManager.send(config);

      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async createSpeakRoom(roomName: string, serverId: string){
    try {
        const config = {
          url: `${AppConfig.api}/server/create-speak-room`,
          method: "POST",
          data:{
            roomName: roomName,
            serverId: serverId
          }
        };
        const result = await RequestManager.send(config);
        console.error(result);
  
        return result.data;
      } catch (error) {
        console.error(error);
        return [];
      }
  }

  static async create() {}
}

export default ServerManager;
