import { getDb } from "./createDatabase";
// const { promisify } = require("util");
// const runDbAsync = promisify(db.run.bind(db));

/* 
  Sorguların çalıştırıldığı sınıftır. Bütün sorgular burada çalıştırılmalıdır.
*/

class DroNetDatabaseManager {
  static async query(query: string) {
    try {
      const db = getDb();
      const res = await new Promise((resolve, reject) => {
        db.exec(query, (err: Error | null, rows: any[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            //console.log(rows);
            resolve(rows);
          }
        });
      });
      //console.log(res);
      return { status: true, data: res };
    } catch (error) {
      console.error(error);
      return { status: false, data: [] };
    }
  }

  static async queryWithParams(query: string, params: any[] = [], returnData = false) {
    try {
      const db = getDb();
      const statement = db.prepare(query);
      let result;
      if (returnData) {
        result = await statement.all(params);
      } else {
        result = await statement.run(params);
      }
      return result;
    } catch (error: any) {
      throw error.message ? error.message : error;
    }
  }
}

export default DroNetDatabaseManager;
