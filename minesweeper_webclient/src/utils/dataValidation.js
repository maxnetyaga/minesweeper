import { config } from "../config";

export const validateIpv4 = (ip) => {
    const ipPattern = new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    );
    return ipPattern.test(ip) || ip === "localhost";
};

export const validatePort = (port) => {
    port = Number(port);
    return port >= 1 && port <= 65535;
};

export const validateGameId = (id) => {
    id = String(id);
    return id.length === config.gameIdLen;
};
