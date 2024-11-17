// import { ipcRenderer } from "electron";
import path from "path";
import { ipcRenderer } from "electron";
import { init as initDb } from "./database/createDatabase";
import { existsSync, mkdirSync } from "fs";

ipcRenderer.on("getAppPath", (event, appPath, userDataPath) => {
  PathManager.setAppPath(appPath, userDataPath);
});
class PathManager {
  static appPath = "";
  static appDB = "";
  static mainPath = "";
  static userDataPath = "";

  static setAppPath(app_path: string, userDataPath: string) {
    // if(process.env.NODE_ENV)
    if (process.env.NODE_ENV === "production") {
      if (app_path.includes("app.asar")) {
        app_path = path.join(app_path, "..", "..");
      }
      PathManager.userDataPath = userDataPath;
      PathManager.appPath = path.join(app_path);
      PathManager.mainPath = path.join(PathManager.appPath);
      PathManager.appDB = path.join(
        PathManager.userDataPath,
        "database"
      );
    } else {
      PathManager.appPath = app_path;
      PathManager.mainPath = path.join(PathManager.appPath, "src");
      PathManager.appDB = path.join(
        PathManager.appPath,
        "src",
        "db"
      );

      PathManager.userDataPath = PathManager.mainPath;
    }

    this.folderControl();
    initDb();
  }

  static folderControl() {
    if (!existsSync(this.DB())) {
      mkdirSync(this.DB());
    }
  }

  static Main(): string {
    return PathManager.mainPath;
  }

  static App(): string {
    return PathManager.appPath;
  }

  static DB(): string {
    return PathManager.appDB;
  }

  static userData(): string {
    return PathManager.userDataPath;
  }
}

//PathManager.setAppPath(process.cwd());
export default PathManager;
