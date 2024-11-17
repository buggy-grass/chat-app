import { length } from "./InputLength";

class DroNetInputManager {
  static compareLength(input: string, module: string): boolean {
    if (input.length > length[module].max) {
        return false;
    } else if (input.length < length[module].min) {
        return false;
    }
    return true;
  }
}

export default DroNetInputManager;
