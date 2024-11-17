import path, { join } from "path";
import DroNetPathManager from "../PathManager";
import { readFileSync, readdirSync } from "fs";
// import DroNetOnStartManager from "../onStart/DronetOnStartManager";
const Database = require("better-sqlite3");
let db: any = null;

export const init = async () => {
  const db_path = DroNetPathManager.DB() + `/dronet.db`;
  db = new Database(db_path);

  let models = path.join(
    DroNetPathManager.Main(),
    "services",
    "database",
    "models"
  );
  if (process.env.NODE_ENV === "production") {
    models = path.join(DroNetPathManager.App(), "database", "models");
  } else {
    models = path.join(
      DroNetPathManager.Main(),
      "services",
      "database",
      "models"
    );
  }

  const files = readdirSync(models).reverse();
  for await (const file of files) {
    const filePath = join(models, file);
    try {
      const data = readFileSync(filePath, { encoding: "utf8" });
      db.exec(data);
    } catch (err) {
      console.error(err);
    }
  }
  // DroNetOnStartManager.onStart();
};

export const getDb = () => {
  return db;
};

// db.exec("INSERT INTO user(user_alias,user_full_name,user_company,user_email,next_token,jwttoken,user_created_at,user_updated_at) VALUES('bugra.cimen','bugra.cimen','Ankara','bugra.cimen','YnVncmEuY2ltZW46YnVncmExMjM=','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJidWdyYS5jaW1lbiIsImlhdCI6MTcxMjY3MDg4MiwiZXhwIjoxNzEyNjkyNDgyfQ.p-0T_ea7T0yRMv6bPJ8PspWKTgdMq3etu_NR-jozfp4','22','1')")

//init();

//export default db;
