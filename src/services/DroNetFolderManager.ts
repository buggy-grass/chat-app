import { v4 as uuid } from "uuid";
import fs from "fs";
import MultiWorkerManager from "./workers/worker-api";
import path from "path";

class DroNetFolderManager {
  static getSelectedFolderImages = async (
    folderPath: string
  ): Promise<FileList> => {
    if (!fs.existsSync(folderPath)) {
      throw "Klasör Bulunamadı!";
    }
    const files = fs.readdirSync(folderPath);

    const jpgFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".jpg" || ext === ".jpeg";
    });

    const dataTransfer = new DataTransfer();
    for (const file of jpgFiles) {
      dataTransfer.items.add(
        new File([fs.readFileSync(path.join(folderPath, file))], file, {
          type: "image/jpeg",
        })
      );
    }

    return dataTransfer.files;
  };

  static async createFolder(
    folderPath: string,
    folderName: string | null
  ): Promise<string> {
    const worker_id = await uuid();
    const worker = new MultiWorkerManager(worker_id);
    const newFolder = await worker.workerFunctions.createFolder(
      folderPath,
      folderName
    );
    worker.terminateMainWorker(worker_id);
    // store.dispatch({ type: "REFRESH_FOLDER" });
    return newFolder.path;
  }

  static getFolderSize(folderPath: string): string {
    const sizeInBytes = this._getFolderSizeInBytes(folderPath);
    if (sizeInBytes === -1) {
      return "0 KB";
    }
    return this.formatBytes(sizeInBytes);
  }

  static _getFolderSizeInBytes(folderPath: string): number {
    if (fs.existsSync(folderPath) === false) {
      return -1;
    }
    const files = fs.readdirSync(folderPath);
    let size = 0;

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        size += stats.size;
      } else if (stats.isDirectory()) {
        size += this._getFolderSizeInBytes(filePath); // Recursive call for directories
      }
    });

    return size;
  }

  static formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  static async existFolder(folderPath: string): Promise<{ status: boolean }> {
    try {
      if (!fs.existsSync(folderPath)) {
        return { status: false };
      }
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  static async deleteFolder(folderPath: string): Promise<boolean> {
    const files = await fs.promises.readdir(folderPath);
    let flag = false;
    for await (const file of files) {
      try {
        const filePath = path.join(folderPath, file);
        const stat = await fs.promises.lstat(filePath);

        if (stat.isDirectory()) {
          await this.deleteFolder(filePath);
        } else {
          await fs.promises.unlink(filePath);
        }
      } catch (error) {
        flag = true;
        break;
      }
    }
    
    if (!flag) {
      await fs.promises.rmdir(folderPath);
    }
    return true;
  }
}

export default DroNetFolderManager;
