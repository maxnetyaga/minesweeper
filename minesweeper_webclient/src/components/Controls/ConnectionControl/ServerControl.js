import { useRef, useState } from "react";

import "./ServerControl.css";

import { validateIpv4, validatePort } from "../../../utils/dataValidation";

export default function ServerControl({ gameStatus, connectToServer }) {
    const [isIpValid, setIsIpValid] = useState(true);
    const [isPortValid, setIsPortValid] = useState(true);

    const ipInputRef = useRef();
    const portInputRef = useRef();

    const connButonClick = async () => {
        const ip = ipInputRef.current.value;
        const port = portInputRef.current.value;

        const isIpValid = validateIpv4(ip);
        setIsIpValid(isIpValid);
        const isPortValid = validatePort(port);
        setIsPortValid(isPortValid);
        if (!isIpValid || !isPortValid) return;

        await connectToServer(ip, port);
    };

    const isServerControlDisabled = ["Connected", "In Progress..."].includes(
        gameStatus
    );

    return (
        <div className="control">
            <div className="control_header">Server control</div>
            <label>Server address:</label>
            <input
                disabled={isServerControlDisabled}
                className={isIpValid ? "" : "invalid"}
                ref={ipInputRef}
                name="ipv4"
                placeholder="x.x.x.x"
                id="ipv4"
                type="text"
            />

            <label>Server Port:</label>
            <input
                disabled={isServerControlDisabled}
                className={isPortValid ? "" : "invalid"}
                ref={portInputRef}
                name="port"
                placeholder="8080"
                id="port"
                type="text"
            />
            <button disabled={isServerControlDisabled} onClick={connButonClick}>
                Connect to server
            </button>
            <div className="connection_status">{gameStatus}</div>
        </div>
    );
}
