import React, { useEffect } from "react";
import "./style/global.css";
import Router from "./routes/sections";
import "./services/database/createDatabase";
import {
  FluentProvider,
  Theme,
  createDarkTheme,
  createLightTheme,
} from "@fluentui/react-components";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import droTheme from "./renderer/theme/droTheme";
import { I18nextProvider } from "react-i18next";
import i18n from "./services/localization/i18n";
//import AppSettingsManager from "./services/appSettings/AppSettingsManager";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { ipcRenderer } from "electron";
import { WindowTitleBar } from "./components/window/WindowTitleBar";
import UserSocketManager from "./services/socket/UserSocketManager";
import ServerManager from "./services/server/ServerManager";
import ServerListActions from "./store/actions/ServerListActions";
import UserActions from "./store/actions/UserActions";
import UserManager from "./services/user/UserManager";

initializeIcons();

const lightTheme: Theme = {
  ...createLightTheme(droTheme),
};

const darkTheme: Theme = {
  ...createDarkTheme(droTheme),
};

lightTheme.fontFamilyBase = "Segoe UI";
darkTheme.fontFamilyBase = "Segoe UI";
darkTheme.colorBrandForeground1 = droTheme[110]; // use brand[110] instead of brand[100]
darkTheme.colorBrandForeground2 = droTheme[120]; // use brand[120] instead of brand[110]

export default function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.userReducer)

  useEffect(()=>{
    console.error(user)
  },[user])

  useEffect(()=>{
    const login = async() =>{
      const login = await UserManager.login("bugra.cimen","bugra123");

      if(login.code == 1){
        console.error(login)
        UserActions.storeUser({
          username: login.data.username,
          nickname: login.data.nickname,
          connectedRoom: login.data.activeRoomId,
          connectedServer: login.data.activeServerId
        });
      }
    }

    login();

    const loadServerList = async () => {
      const servers = await ServerManager.list();
      ServerListActions.update(servers);
    };

    loadServerList();
    // Bileşen yüklendiğinde çağrılan fonksiyon
    const initializeVoiceChat = async () => {
      await UserSocketManager.connect();
      await UserSocketManager.startStream();
      UserSocketManager.listen();
    };

    initializeVoiceChat();

    // Temizleme işlemleri (opsiyonel)
    return () => {
      // Bileşen unmounted olduğunda yapılacak işlemler
      // Örneğin: Kullanıcıdan mikrofon akışını durdurma veya socket bağlantısını kapatma
      UserSocketManager.socket.disconnect(); // Socket bağlantısını kapat
    };
  },[])

  return (
    <I18nextProvider i18n={i18n}>
      <FluentProvider theme={true ? darkTheme : lightTheme}>
        <WindowTitleBar/>
        <Router />
      </FluentProvider>
    </I18nextProvider>
  );
}
