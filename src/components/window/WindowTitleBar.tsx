import React from "react";
import { makeStyles } from "@mui/styles";
import { Stack } from "@fluentui/react";
import { Button, Label } from "@fluentui/react-components";
import {
  MicPulse20Filled,
  DismissRegular,
  RectangleLandscapeRegular,
  ArrowAutofitDownRegular,
} from "@fluentui/react-icons";
import { ipcRenderer } from "electron";

const customStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    minHeight: "30px",
    borderBottom: "1px solid #404040",
    backgroundColor: "#313131",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dragArea: {
    width: "100%",
  },
  button: {
    minWidth:"50px",
    maxHeight: "31px",
  },
});

export const WindowTitleBar = () => {
  const styles = customStyles();

  const handleAppController = (clicked: string) =>{
    ipcRenderer.send("window-title-bar-controller", clicked);
  }

  return (
    <div className={styles.root} id="window-title-bar">
      <Stack className={styles.container}>
        <Stack.Item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100px",
            minWidth: "100px",
          }}
        >
          <MicPulse20Filled />
          <Label style={{ marginLeft: "5px" }}>Mecord</Label>
        </Stack.Item>
        <div id="window-title-bar-drag-area" className={styles.dragArea}></div>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            maxWidth: "150px",
            minWidth: "150px",
          }}
        >
          <Button
            shape="square"
            icon={<ArrowAutofitDownRegular />}
            appearance="subtle"
            className={styles.button}
            onClick={()=>handleAppController("minimize")}
          />
          <Button
            shape="square"
            icon={<RectangleLandscapeRegular />}
            appearance="subtle"
            className={styles.button}
            onClick={()=>handleAppController("maximize")}
          />
          <Button
            shape="square"
            icon={<DismissRegular />}
            appearance="subtle"
            className={styles.button}
            onClick={()=>handleAppController("exit")}
          />
        </Stack>
      </Stack>
    </div>
  );
};
