import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Divider,
  Input,
  Label,
  LargeTitle,
  Persona,
  Subtitle1,
  Subtitle2,
  makeStyles,
} from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import {
  TextAddRegular,
  SendRegular,
  EmojiRegular,
  DocumentFolderRegular,
  AttachRegular
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#353535",
    width: "100%",
    height: "100px",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    padding: "1rem",
  },
  newTextArea: {
    width: "100%",
    height: "100px",
  },
});
const messagePanel = () => {
  const styles = useStyles();
  const messages = useSelector((state: RootState) => state.MessagePanelReducer);

  useEffect(() => {
    console.error(messages);
  }, [messages]);
  return (
    <Stack className={styles.root}>
      {messages.header != "" && (
        <Stack className={styles.header}>
          <TextAddRegular
            style={{ width: "32px", height: "32px", marginLeft: "15px" }}
          />
          <Subtitle1 style={{ marginLeft: "10px" }}>
            {messages.header}
          </Subtitle1>
        </Stack>
      )}
      <Stack className={styles.body}>
        {messages.messages.map((message, index: number) => (
          <Stack
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: index != 0 ? "15px" : "0px",
            }}
          >
            <Stack
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Persona
                name={message.user + " : "}
                size="extra-large"
                avatar={{ color: "colorful" }}
                presence={{ status: "available" }}
                style={{
                  display: "flex", // Flexbox ile hizalamak
                  alignItems: "center", // Dikey olarak ortala
                  textAlign: "center", // Metinleri ortala
                }}
              />
              <Stack style={{ marginLeft: "10px" }}>
                <Label>{message.message}</Label>
              </Stack>
            </Stack>
            <Divider style={{ marginTop: "15px" }} />
          </Stack>
        ))}
      </Stack>
      <Stack className={styles.newTextArea}>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            paddingRight: "2rem",
            paddingLeft: "2rem",
          }}
        >
          <Stack style={{ width: "calc(100% - 100px)" }}>
            <Input
              size="large"
              placeholder="Write your text..."
              contentAfter={
                <SendRegular
                  style={{
                    transform: "rotate(-45deg)",
                    marginTop: "-2px",
                    marginLeft: "3px",
                  }}
                />
              }
            />
          </Stack>
          <Stack style={{marginLeft:"10px", width: "100px", display:"flex", flexDirection:"row", alignItems:"center" }}>
            <EmojiRegular style={{ width: "32px", height: "32px" }} />
            <AttachRegular style={{ width: "32px", height: "32px" }}/>
            <DocumentFolderRegular style={{ width: "32px", height: "32px" }}/>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default messagePanel;
