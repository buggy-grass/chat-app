import axios, { AxiosResponse } from "axios";
class RequestManager {
  static async send(config: Record<string, unknown>): Promise<{ status: boolean; data: Record<string, unknown> }> {
    const result: AxiosResponse<any> = await axios(config);
    if (result.status === 200) {
      return { status: true, data: result.data };
    } else {
      return { status: false, data: result.data };
    }
  }
}

export default RequestManager;
