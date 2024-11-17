import { AppConfig } from "../../config/AppConfig";
import RequestManager from "../RequestManager";

/* 
  Kullanıcı ile ilgili işlemlerin yapıldığı sınıftır.
*/

class UserManager {
  static async login(username: string, password: string): Promise<any>{
    const config = {
      url: `${AppConfig.api}/user/login`,
      method: "POST",
      data:{
        username: username,
        password: password
      }
    };

    const login = await RequestManager.send(config);

    return login.data;
  }
}

export default UserManager;
