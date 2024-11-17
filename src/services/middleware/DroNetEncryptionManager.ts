import * as crypto from 'crypto';
import DroNetDatabaseManager from '../database/DroNetDatabaseManager';

class DroNetEncryptionManager {
  static encryptionKey = "";

  static async addEncryptionKey(): Promise<void> {
    const query = `INSERT OR IGNORE INTO t_table ('index') VALUES (?)`;
    await DroNetDatabaseManager.queryWithParams(query, [1]);
  }

  static async setEncryptionKey(): Promise<string> {
    const query = `
    SELECT es FROM t_table LIMIT 1
`;
    const row = await DroNetDatabaseManager.queryWithParams(query, [], true);
    this.encryptionKey = row[0].es;
    return row[0].es;
  }

  static encryptText(text: string): string {
    const iv = crypto.randomBytes(16); // IV (Initialization Vector) oluştur
    const cipher = crypto.createCipheriv('aes-192-cbc', Buffer.from(this.encryptionKey, 'base64'), iv);
    let encryptedToken = cipher.update(text, 'utf-8', 'hex');
    encryptedToken += cipher.final('hex');
    return iv.toString('hex') + encryptedToken;
  }

  static decryptText(encryptedText: string): string {
    const ivLength = 16; // IV uzunluğu
    const iv = Buffer.from(encryptedText.slice(0, ivLength * 2), 'hex'); // IV'yi al

    const encryptedData = encryptedText.slice(ivLength * 2);
    const keyBuffer = Buffer.from(this.encryptionKey, 'base64');
    const decipher = crypto.createDecipheriv('aes-192-cbc', keyBuffer, iv);
    // Decryption işlemi
    let decryptedText = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedText += decipher.final('utf-8');
    return decryptedText;
  }

}

export default DroNetEncryptionManager;