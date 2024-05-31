import { createContext, useEffect, useState } from "react";

import "./Game.css";

import { waitForOpenConnection } from "../../utils/networking";

import Field from "../Field/Field";
import Controls from "../Controls/Controls";

export const WebSocketContext = createContext({
    webSocket: null,
    setWebSocket: () => {},
});

export function Game() {
    const [webSocket, setWebSocket] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [fieldSize, setFieldSize] = useState(16);
    const [gameDifficulty, setGameDifficulty] = useState("Easy");
    const [gameStatus, setGameStatus] = useState("Not Connected");

    useEffect(() => {
        if (webSocket) {
            // webSocket.send(JSON.stringify({ action: "connect" }));

            // webSocket events
            webSocket.addEventListener("message", (e) => {
                const message = JSON.parse(e.data);
                console.dir(message);
                if (message?.action === "init") {
                    setGameId(message?.gameId);
                }
            });

            webSocket.addEventListener("close", (e) => {
                setWebSocket(null);
                setGameId(null);
                setGameStatus("Lost Connection");
            });
        }
    }, [webSocket]);

    const connectToServer = async (ip, port) => {
        const ws = new WebSocket(`ws://${ip}:${port}`);
        try {
            await waitForOpenConnection(ws);
        } catch {
            setGameStatus("Server is unreachable");
            return false;
        }
        setGameStatus("Connected");
        setWebSocket(ws);
        return true;
    };

    return (
        <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
            <section className="game">
                <Controls
                    {...{
                        gameId,
                        gameStatus,
                        connectToServer,
                        fieldSize,
                        setFieldSize,
                        gameDifficulty,
                        setGameDifficulty,
                    }}
                />
                <Field
                    {...{
                        fieldSize,
                        webSocket,
                        gameStatus,
                        setGameStatus,
                        gameDifficulty,
                    }}
                />
            </section>
        </WebSocketContext.Provider>
    );
}
