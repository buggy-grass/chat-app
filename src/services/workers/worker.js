import Comlink from 'comlink'
import { spawn, spawnSync } from "child_process";
import os from 'os';
import fs from 'fs';
import path from 'path';
import ExifReader from "exifreader";
import moment from "moment";

const fns = {
  /* Genel shell komutu çalıştırmak için bir fonksiyon. */
  async cmd_exec(
    combined,
    args,
    errControl = true,
    stderrCont = true,
    cwd = process.cwd()
  ) {
    let shellStatus = true;
    if (os.platform() == 'darwin') {
      shellStatus = true;
    }
    const result = spawnSync(combined, args, { shell: shellStatus, cwd });

    if (result.error && errControl) {
      throw { status: false, data: result.error.toString() };
    }

    if (result.stderr && stderrCont) {
      // rapor oluşturulamadıysa
      if (result.stderr.includes("dro400")) {
        return { status: false, data: result.stderr.toString(), code: 400 };
      }
      else if (result.stderr.includes("Error") || result.stderr.includes("error")) {
        throw result.stderr.toString();
      }
      else if (result.stdout.includes("dro200")) {
        return { status: true, data: result.stdout.toString() };
      }
      else if (result.stderr.toString() != "") {
        return { status: true, data: result.stderr.toString() };
      }
    }
    return { status: true, data: "result.stdout.toString()" };
  },
  /* ODM'de logları izlemek için spawn metodu kullanıldı. */
  async cmd_exec_odm(combined,
    args,
    errControl = true,
    stderrCont = true) {
    let shellStatus = true;
    if (os.platform() == 'darwin') {
      shellStatus = true;
    }
    const childProcess = spawn(combined, args, { shell: shellStatus });
    childProcess.stdout.on('data', (data) => {
      console.error(data.toString());
      // Log redux'a yazılır.
      self.postMessage({ type: 'OdmLogReducer/ADD_STAGE_LOG', payload: data.toString() });
      //console.error(data.toString());
    });

    let errorMessage = '';
    if (errControl || stderrCont) {
      childProcess.stderr.on('data', (data) => {
        errorMessage += data.toString(); // Hata mesajını biriktir
      });
    }

    return new Promise((resolve, reject) => {
      childProcess.on('close', (code) => {
        if (code !== 0) {
          if (errControl && errorMessage) {
            reject({ status: false, data: errorMessage });
          } else {
            reject({ status: false, data: `Child process exited with code ${code}` });
          }
        } else {
          resolve({ status: true, data: "İşlem tammanlandı!" });
        }
      });
    });
  },
  async previewBlobToBase64(blob, width, height) {
    try {
      let n_image = await fns.fileToBlob(blob);
      let new_image = await new Promise((resolve, reject) => {
        createImageBitmap(n_image).then((imageBitmap) => {
          const resizedCanvas = new OffscreenCanvas(Number(width), Number(height));
          const resizedContext = resizedCanvas.getContext("2d");
          resizedContext.drawImage(imageBitmap, 0, 0, Number(width), Number(height));
          resizedCanvas
            .convertToBlob({ type: n_image.type, quality: 1 })
            .then(async (blob) => {
              let reader = new FileReader();

              reader.onload = function () {
                let dataUrl = reader.result;
                let base64 = dataUrl.split(",")[1];
                let data = "data:text/plain;base64," + base64;
                resolve(data);
              };
              reader.readAsDataURL(blob);
            }).catch((error) => {
              console.error(error)
              reject(false)
            })
        }).catch((error) => {
          console.error(error)
          reject(false)
        })
      });

      return new_image;
    } catch (error) {
      return false;
    }
  },
  async fileToBlob(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result], { type: file.type });
        resolve(blob);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },
  async createFolder(folderPath, folderName) {
    try {
      const newFolder =
        folderName == null ? folderPath : path.join(folderPath, folderName);
      if (!fs.existsSync(newFolder)) {
        fs.mkdirSync(newFolder);
      }
      // store.dispatch({ type: "REFRESH_FOLDER" });
      return { status: true, path: newFolder };
    } catch (error) {
      console.error(error)
      console.error(folderName, "Create Folder Error!");
      return { status: false, path: folderPath };
    }
  },
  async writeMultiFile(filePath, files) {
    for await (const file of files) {
      const fileData = await this.readFileData(file.file);
      const fileName = `${file.file.name}`;
      const newPath = await path.join(filePath, fileName);
      const buffered = await Buffer.from(fileData);
      await new Promise((resolve) => {
        fs.writeFile(newPath, buffered, (err) => {
          if (err) {
            resolve(fileName);
            console.error(`Dosyaya ${fileName} yazma hatası:`, err);
          } else {
            resolve(null);
            console.error(`${fileName} dosyasına başarıyla yazıldı.`);
          }
        });
      })
    }

    return { status: true, path: filePath };
  },
  async readFileData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  },
  async getImageExif(imagePath, name) {
    const image = fs.readFileSync(imagePath);
    const exif = await ExifReader.load(image);
    // Tarih-zaman string'ini JavaScript'in kabul ettiği bir formata dönüştür
    const dateStr = exif.DateTimeOriginal?.description ?? -1;
    let timestamp = -1;

    if (dateStr != -1) {
      // Tarih-zaman string'ini moment ile dönüştür
      const format = 'YYYY:MM:DD HH:mm:ss';
      const date = moment(dateStr, format).toDate();
      timestamp = date.getTime(); // Unix timestamp (milisaniye cinsinden) 
    }

    const exifInfo = {
      lat: Number(Number(exif.GPSLatitude?.description).toFixed(6)) || -1,
      lon: Number(Number(exif.GPSLongitude?.description).toFixed(6)) || -1,
      alt: Number(Number(exif.AbsoluteAltitude?.value).toFixed(2)) || -1,
      rtkFlag: exif.RtkFlag?.value == "50" ? true : false,
      imageName: name,
      date: timestamp,
    };
    return exifInfo;
  },
  async getImageListExif(projectPath, imageList) {
    const exifList = [];
    for await (const image of imageList) {
      const imgPath = projectPath + "/images" + "/" + image;
      const exif = await this.getImageExif(imgPath, image);
      exifList.push(exif);
    }
    return exifList;
  },
};

Comlink.expose(fns);
