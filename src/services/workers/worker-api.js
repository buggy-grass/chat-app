import { wrap } from 'comlink';
import Worker from 'worker-loader!./worker.js';
import DroNetProcessLogManager from '../log/DroNetProcessLogManager';

const workers = [];
class MultiWorkerManager {
    constructor(main_worker_id) {
        this.workerFunctions = {
            cmd_exec: function (worker_id, params, errControl, stderrCont, cwd) { return worker_id, params, errControl, stderrCont, cwd; },
            cmd_exec_odm: function (worker_id, params, errControl, stderrCont) { return worker_id, params, errControl, stderrCont; },
            createFolder: function (folderPath, folderName) { return folderPath, folderName; },
            writeMultiFile: function (filePath, files) { return filePath, files },
            previewBlobToBase64: function (blob, width, height) { return blob, width, height },
            terminate: function () { return; },
            getImageExif: function (imagePath, name) { return imagePath, name; },
            getImageListExif: function (imagePath, name) { return imagePath, name; },
        };
        this.messageHandlers = {};
        this.main_worker = main_worker_id;

        this.initializeWorkers();
    }

    initializeWorkers() {
        const wrkr = new Worker();
        const worker = wrap(wrkr);

        wrkr.onmessage = (event) => {
            const { type, payload } = event.data;
            //console.error(event.data);
            // redux'a log eklenir.
            if (type === 'OdmLogReducer/ADD_STAGE_LOG') {
                DroNetProcessLogManager.controlProcessLog(payload);
            }
        };

        this.workerFunctions = {
            cmd_exec: worker.cmd_exec,
            createFolder: worker.createFolder,
            writeMultiFile: worker.writeMultiFile,
            previewBlobToBase64: worker.previewBlobToBase64,
            cmd_exec_odm: worker.cmd_exec_odm,
            terminate: worker.terminate,
            getImageExif: worker.getImageExif,
            getImageListExif: worker.getImageListExif,
            loadMesh: worker.loadMesh
        }

        const workerId = this.main_worker;

        workers.push({ worker_id: workerId, worker: wrkr, subworkers: [] });
    }

    addSubWorker({ main_worker_id, subworker_id }) {
        workers.forEach((worker) => {
            if (worker.worker_id === main_worker_id) {
                const wrkr = new Worker();
                wrap(wrkr);

                this.workerFunctions = {
                    cmd_exec: wrkr.cmd_exec,
                    createFolder: wrkr.createFolder,
                    writeMultiFile: wrkr.writeMultiFile,
                    previewBlobToBase64: wrkr.previewBlobToBase64,
                    getImageExif: wrkr.getImageExif,
                    getImageListExif: wrkr.getImageListExif,
                    terminate: wrkr.terminate
                }

                worker.subworkers.push({ subworker_id: subworker_id, subworker: wrkr });
            }
        })
    }

    terminateSubWorker({ main_worker_id, subworker_id }) {
        workers.forEach((main_worker, main_index) => {
            if (main_worker.worker_id == main_worker_id) {
                main_worker.subworkers.forEach((subworker, sub_index) => {
                    if (subworker.subworker_id == subworker_id) {
                        subworker.subworker.terminate();
                        workers[main_index].subworkers.splice(sub_index, 1);
                    }
                })
            }
        })
    }

    terminateMainWorker(main_worker_id) {
        workers.forEach((main_worker, main_index) => {
            if (main_worker.worker_id === main_worker_id) {
                if (main_worker.subworkers.length > 0) {
                    main_worker.subworkers.forEach((sub_worker, sub_index) => {
                        sub_worker.sub_worker.terminate();
                        sub_worker.sub_worker.splice(sub_index, 1);
                    })
                }
                workers[main_index].worker.terminate();
                workers.splice(main_index, 1);
            }
        });
    }

    getWorkers() {
        return workers;
    }
}

export default MultiWorkerManager;
