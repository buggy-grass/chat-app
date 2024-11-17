class DroNetCookieManager {
    public static setCookie(cookieName: string, value: string): void {
        document.cookie = `${cookieName}=${value};`;
    }

    public static getCookie(cookieName: string): string {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

export default DroNetCookieManager;
