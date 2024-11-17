import * as React from "react";
import { Stack } from "@fluentui/react";
import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ControlPanel from "../components/controlPanel";
import { makeStyles } from "@fluentui/react-components";
import MessagePanel from "../components/messagePanel";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "calc(100vh - 33px)",
  },
});
export default function MainPage() {
  const styles = useStyles();
  const messagesShow = useSelector(
    (state: RootState) => state.MessagePanelReducer.show
  );
  // useEffect(() => {
  //   LeftMenuActions.setSelectedMenu("home");
  // }, []);

  return (
    <Stack className={styles.root}>
      <ControlPanel />
      <Stack
        style={{
          position: "relative",
          // left: "64px",
          width: "100%",
          height: "100%",
        }}
      >
        {messagesShow && <MessagePanel />}
      </Stack>
    </Stack>
  );
}
