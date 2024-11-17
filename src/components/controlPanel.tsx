import { Stack } from "@fluentui/react";
import {
  Button,
  Label,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Persona,
  Tree,
  TreeItem,
  TreeItemLayout,
  makeStyles,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  DismissRegular,
  Mic32Regular,
  TextAdd20Regular,
  TabletSpeaker20Regular,
  CallConnecting20Regular,
} from "@fluentui/react-icons";
import { MessagePanelActions, UserActions } from "../store/actions/actions";
import ServerManager from "../services/server/ServerManager";
import CreateSpeakRoom from "./server/createSpeakRoom";
import UserSocketManager from "../services/socket/UserSocketManager";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const useStyles = makeStyles({
  root: {
    width: "400px",
    background: "#333333",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "30px",
    background: "#252525",
  },
  body: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "0.75rem",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "130px",
    background: "#212121",
  },
  userController: {
    width: "90px",
    marginLeft: "5px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  userButtons: {
    minHeight: "40px",
    minWidth: "40px",
  },
  hideExpandIcon: {
    "& .fui-TreeItemLayout__expandIcon": {
      display: "none",
    },
  },
});

const controlPanel = () => {
  const serverList = useSelector(
    (state: RootState) => state.ServerListReducer.serverList
  );
  const [openServerProperties, setOpenServerProperties] = useState<
    number | null
  >(null);
  const connectionStatus = useSelector(
    (state: RootState) => state.SocketConnectionReducer.connection
  );
  const [openCreateSpeakRoom, setOpenCreateSpeakRoom] =
    useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const styles = useStyles();
  const user = useSelector((state: RootState) => state.userReducer);

  const openTextPanel = (server: string, textArea: string, messages: any) => {
    MessagePanelActions.open({
      show: true,
      header: `${server} - ${textArea}`,
      messages: messages,
    });
  };

  const handleLeaveRoom = (serverId: string, roomId: string) => {
    UserSocketManager.leaveRoom(serverId, roomId);
    UserActions.connectedRoom("");
    UserActions.connectedServer("");
  };

  const handleOpenCreateSpeakRoom = (serverId: string) => {
    setOpenCreateSpeakRoom(true);
    setSelectedServer(serverId);
  };

  const closeCreateSpeakRoom = () => {
    setOpenCreateSpeakRoom(false);
  };

  const handleOpenServerProperties = (index: number) => {
    setOpenServerProperties(openServerProperties === index ? null : index);
  };

  const handleJoinRoom = (serverId: string, roomId: string, oldServerId: string, oldRoomId: string) => {
    UserSocketManager.joinRoom(serverId, roomId);
    UserActions.connectedRoom(roomId);
    UserActions.connectedServer(serverId);
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    event.preventDefault(); // Varsayılan sağ tık menüsünü engelle
    setAnchorEl(event.currentTarget); // Sağ tık yapılan öğeyi ayarla
    setOpenServerProperties(index); // Menüyü aç
  };

  const handleClose = () => {
    setOpenServerProperties(null); // Menü kapat
    setAnchorEl(null); // Ayarı temizle
  };

  return (
    <Stack className={styles.root}>
      <Stack className={styles.header}>
        <Label style={{ marginLeft: "10px" }}>Server List</Label>
      </Stack>
      <Stack className={styles.body}>
        <Tree aria-label="Default" size="small">
          {serverList?.map((server: any, index: number) => (
            <TreeItem
              itemType="branch"
              key={index}
              style={{ marginTop: index != 0 ? "10px" : "0px" }}
              className={styles.hideExpandIcon}
            >
              <Menu
                key={index}
                positioning={"before-top"}
                open={openServerProperties === index}
                onOpenChange={(e, data) => {
                  if (!data.open) handleClose();
                }}
              >
                <MenuTrigger disableButtonEnhancement>
                  <TreeItemLayout
                    onClick={(e) => handleOpenServerProperties(index)}
                    onContextMenu={(e) => handleContextMenu(e, index)}
                  >
                    <Persona
                      name={server.name}
                      size="extra-large"
                      avatar={{ color: "colorful" }}
                      style={{
                        display: "flex", // Flexbox ile hizalamak
                        alignItems: "center", // Dikey olarak ortala
                        textAlign: "center", // Metinleri ortala
                      }}
                    />
                    {/* İsterseniz burada secondaryText veya diğer bilgiler ekleyebilirsiniz */}
                  </TreeItemLayout>
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem
                      onClick={() => handleOpenCreateSpeakRoom(server.id)}
                    >
                      Konuşma Odası Ekle
                    </MenuItem>
                    <MenuItem>Yazı Alanı Ekle</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>

              {/* Her bir Persona'nın altında alt öğeler eklemek için bir Tree bileşeni oluşturabilirsiniz */}
              <Tree>
                {server.textArea.map((_textArea: any) => (
                  <TreeItem
                    itemType="leaf"
                    key={_textArea.id}
                    style={{ cursor: "pointer" }}
                  >
                    <TreeItemLayout
                      onClick={() =>
                        openTextPanel(
                          server.name,
                          _textArea.name,
                          _textArea.messages
                        )
                      }
                    >
                      <TextAdd20Regular
                        style={{ transform: "translate(-3px,5px)" }}
                      />
                      <Label style={{ cursor: "pointer" }}>
                        {_textArea.name}
                      </Label>
                    </TreeItemLayout>
                  </TreeItem>
                ))}
                {server.room.map((_room: any) => (
                  <TreeItem
                    itemType="leaf"
                    key={_room.id}
                    style={{ cursor: "pointer" }}
                  >
                    <TreeItemLayout
                      onClick={() => handleJoinRoom(server.id, _room.id, user.connectedServer, user.connectedRoom)}
                    >
                      <TabletSpeaker20Regular
                        style={{ transform: "translate(-3px,5px)" }}
                      />
                      <Label style={{ cursor: "pointer" }}>{_room.name}</Label>
                    </TreeItemLayout>
                    <Stack style={{ marginTop: "5px" }}>
                      {_room.activeUsers.map(
                        (activeUser: any, index: number) => (
                          <Persona
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingLeft: "48px",
                              textAlign: "center",
                            }}
                            key={index}
                            name={activeUser.nickname}
                            size="small"
                            presence={{ status: "do-not-disturb" }}
                            avatar={{
                              image: {
                                src: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/persona-male.png",
                              },
                            }}
                          />
                        )
                      )}
                    </Stack>
                  </TreeItem>
                ))}
              </Tree>
            </TreeItem>
          ))}
        </Tree>
      </Stack>
      <Stack className={styles.footer}>
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack
            style={{
              height: "30px",
              background:
                connectionStatus == 0
                  ? "#F73131"
                  : connectionStatus == 1
                  ? "#7CF7"
                  : "#89C07E",
            }}
          >
            <Stack
              style={{
                marginLeft: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CallConnecting20Regular />
              <Label style={{ marginLeft: "5px" }}>
                {connectionStatus == 0
                  ? "Connecting Error!"
                  : connectionStatus == 1
                  ? "Connecting Server..."
                  : "Connected Server."}
              </Label>
            </Stack>
          </Stack>
          <Stack
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100px",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
            }}
          >
            <Persona
              name="MINSTERRACTH"
              size="extra-large"
              secondaryText="Do Not Disturb"
              presence={{ status: "do-not-disturb" }}
              avatar={{
                image: {
                  src: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/persona-male.png",
                },
              }}
            />
            <Stack className={styles.userController}>
              <Button
                shape="circular"
                className={styles.userButtons}
                icon={<Mic32Regular />}
              />
              <Button
                shape="circular"
                className={styles.userButtons}
                icon={<DismissRegular />}
                onClick={() => handleLeaveRoom(user.connectedServer, user.connectedRoom)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {openCreateSpeakRoom && (
        <CreateSpeakRoom
          serverId={selectedServer}
          open={openCreateSpeakRoom}
          onClose={closeCreateSpeakRoom}
        />
      )}
    </Stack>
  );
};

export default controlPanel;
