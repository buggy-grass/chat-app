import MultiWorkerManager from "./workers/worker-api";
import { readFileSync, unlink, writeFile, existsSync } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";

class DroNetFileManager {
  static multi_worker: MultiWorkerManager;
  // static async writeMultiFile(
  //   filePath: string,
  //   custom_worker_id?: string
  // ): Promise<string> {
  //   const worker_id = custom_worker_id ? custom_worker_id : await uuid();
  //   this.multi_worker = new MultiWorkerManager(worker_id);
  //   const result = await this.multi_worker.workerFunctions.writeMultiFile(
  //     filePath,
  //     files
  //   );
  //   this.multi_worker.terminateMainWorker(worker_id);

  //   return result.path;
  // }

  static async deleteFile(filePath: string): Promise<boolean> {
    const res: boolean = await new Promise((resolve) => {
      unlink(filePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            console.error(`Hata: ${filePath} bulunamadı.`);
          } else if (err.code === "EACCES") {
            console.error(
              `Hata: ${filePath} dosyasını silmek için yeterli izniniz yok.`
            );
          } else {
            console.error(
              `Hata: ${filePath} dosyasını silerken bir hata oluştu: ${err.message}`
            );
          }
          resolve(false);
        } else {
          console.error(`${filePath} başarıyla silindi.`);
          resolve(true);
        }
      });
    });
    return res;
  }

  static async writeCustomFile(
    // txt , config v.b
    fileName: string,
    folderPath: string,
    fileContent: string
  ) {
    const filePath = path.join(folderPath, fileName);
    writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error("Dosya yazma hatası:", err);
        return;
      }
      /* console.error(
        `${fileName} dosyası başarıyla oluşturuldu ve içerik yazıldı.`
      ); */
    });
  }

  static async existFile(filePath: string): Promise<{ status: boolean }> {
    try {
      if (!existsSync(filePath)) {
        return { status: false };
      }
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  static async readCustomFile(
    // txt , config v.b
    fileName: string,
    folderPath: string
  ) {
    const filePath = path.join(folderPath, fileName);
    return readFileSync(filePath, "utf-8");
  }

  static getFileAsBlob(filePath: string): Blob {
    return new Blob([readFileSync(filePath)]);
  }
}

export default DroNetFileManager;
