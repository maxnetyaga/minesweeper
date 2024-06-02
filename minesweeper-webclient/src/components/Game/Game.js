import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";

import "./Game.css";

import {
    waitForOpenConnection,
    getStartEvent,
    getPlayEvent,
} from "../../utils/networking";
import { config } from "../../config";

import Field from "../Field/Field";
import Controls from "../Controls/Controls";

export function Game() {
    const [webSocket, setWebSocket] = useState(null);
    const [gameId, setGameId] = useState(null);

    const [field, updateField] = useImmer(Array(config.defFieldSize ** 2));

    const fieldSize = useMemo(() => Math.sqrt(field.length), [field]);
    const setFieldSize = (fieldSize) =>
        updateField((draft) => (draft = Array(fieldSize ** 2)));

    const [gameDifficulty, setGameDifficulty] = useState("Easy");

    const [gameStatus, setGameStatus] = useState("Not Connected");

    const connectToServer = async (ip, port) => {
        const ws = new WebSocket(`ws://${ip}:${port}`);
        try {
            await waitForOpenConnection(ws, 3, 200);
        } catch {
            setGameStatus("Server is unreachable");
            return false;
        }
        setGameStatus("Connected");
        setWebSocket(ws);
        return true;
    };

    const sendStartEvent = (cellId) => {
        const startEvent = getStartEvent(fieldSize, gameDifficulty, cellId);
        webSocket.send(JSON.stringify(startEvent));
    };

    const sendPlayEvent = (cellId, event) => {
        const playEvent = getPlayEvent(cellId, event);
        webSocket.send(JSON.stringify(playEvent));
    };

    const receiveMoves = useCallback((message) => {
        updateField((draft) => {
            const gameStatus = message["moveData"][0];
            const moves = message["moveData"][1];
            for (const [id, state, value] of moves) {
                draft[id] = { state, value };
            }
        });
    });

    const startGame = (cellId) => {
        sendStartEvent(cellId);
        setGameStatus("In Progress...");
        sendPlayEvent(cellId, "reveal");
    };

    useEffect(() => {
        const clearField = () => {
            updateField((draft) => (draft = Array(config.defFieldSize ** 2)));
        };

        if (webSocket) {
            // webSocket events
            webSocket.addEventListener("message", (e) => {
                const message = JSON.parse(e.data);
                console.dir(message);

                if (message?.action === "init") {
                    setGameId(message?.gameId);
                } else if (message?.action === "move") {
                    receiveMoves(message);
                }
            });

            webSocket.addEventListener("close", (e) => {
                setWebSocket(null);
                setGameId(null);
                clearField();
                setGameStatus("Lost Connection");
            });
        }
    }, [webSocket, receiveMoves]);

    return (
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
                    field,
                    fieldSize,
                    gameStatus,
                    startGame,
                    sendPlayEvent,
                }}
            />
        </section>
    );
}
