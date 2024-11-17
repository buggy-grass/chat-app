import DroNetDatabaseManager from "../database/DroNetDatabaseManager";
import DroNetEncryptionManager from "./DroNetEncryptionManager";
import DroNetLocalStorageManager from "./DroNetLocalStorageManager";

const jwt = require('jsonwebtoken');

export default class DroNetMiddleware {
    static TOKEN_SECRET = '';

    static setTokenSecret = async () => {
        const query = `
    SELECT ts FROM t_table LIMIT 1
`;
        const row = await DroNetDatabaseManager.queryWithParams(query, [], true);
        this.TOKEN_SECRET = row[0].ts;
        return row[0].ts;
    }

    // static pageControl = async (): Promise<boolean> => {
    //     const result = await this.checkToken();
    //     if (result?.status) {
    //         const userData = DroNetLocalStorageManager.getItem("user");
    //         if (!userData) {
    //             DroNetLoginManager.logout();
    //             throw "Kullanıcı bilgileri bulunamadı!";
    //         }
    //         await DroNetLoginManager.storeUser(userData);
    //         return true;
    //     }
    //     throw "Token expired";
    // }

    static async checkToken(): Promise<{ status: boolean, token: string, user_alias: string } | undefined> {
        const token = await DroNetLocalStorageManager.getItem('token');
        const tokenAsStr = token as string;
        if (!token) {
            throw 'Token not found';
        }
        const tokenDecrypted = DroNetEncryptionManager.decryptText(tokenAsStr);
        const isValidToken = this.verifyToken(tokenDecrypted);

        if (isValidToken) {
            return { status: true, token: tokenAsStr, user_alias: isValidToken.sub };
        } else {
            throw 'Invalid token';
        }
    }

    static verifyToken = (token: string) => {
        return jwt.verify(token, this.TOKEN_SECRET);
    }
}