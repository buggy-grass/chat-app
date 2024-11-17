class DroNetLocalStorageManager {
    public static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public static getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item) as T;
            } catch (error) {
                console.error("Local storage item parsing error:", error);
                return null;
            }
        }
        return null;
    }

    public static removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}

export default DroNetLocalStorageManager;
