import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";

import "./Game.css";

import {
    waitForOpenConnection,
    getStartEvent,
    getJoinEvent,
    getPlayEvent,
} from "../../utils/networking";
import { config } from "../../config";

import Field from "../Field/Field";
import Controls from "../Controls/Controls";

Object.defineProperty(String.prototype, "capitalize", {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    },
    enumerable: false,
});

export function Game() {
    const [webSocket, setWebSocket] = useState(null);
    const [gameId, setGameId] = useState(null);

    const [field, updateField] = useImmer(Array(config.defFieldSize ** 2));
    const fieldSize = useMemo(() => Math.sqrt(field.length), [field]);

    const [gameDifficulty, setGameDifficulty] = useState("Easy");

    const [gameStatus, setGameStatus] = useState("Not Connected");

    const setField = useCallback(
        (fieldSize) => updateField((draft) => (draft = Array(fieldSize ** 2))),
        [updateField]
    );

    const setGame = useCallback(
        (gameId, fieldSize, gameDifficulty) => {
            setGameId(gameId);
            setField(fieldSize);
            setGameDifficulty(gameDifficulty.capitalize());
        },
        [setGameId, setField, setGameDifficulty]
    );

    const connectToServer = async (ip, port) => {
        const ws = new WebSocket(`ws://${ip}:${port}`);
        try {
            await waitForOpenConnection(ws, 3, 200);
        } catch {
            setGameStatus("Server is unreachable");
            return false;
        }
        setGameStatus("Connected");
        setField(fieldSize);
        setWebSocket(ws);
        return true;
    };

    const sendStartEvent = (cellId) => {
        const startEvent = getStartEvent(fieldSize, gameDifficulty, cellId);
        webSocket.send(JSON.stringify(startEvent));
    };

    const sendJoinEvent = (gameId) => {
        const joinEvent = getJoinEvent(gameId);
        webSocket.send(JSON.stringify(joinEvent));
    };

    const sendPlayEvent = (cellId, event) => {
        const playEvent = getPlayEvent(cellId, event);
        webSocket.send(JSON.stringify(playEvent));
    };

    const receiveMoves = useCallback(
        (message) => {
            updateField((draft) => {
                // const gameStatus = message["moveData"][0];
                const moves = message["moveData"][1];
                for (const [id, state, value] of moves) {
                    draft[id] = { state, value };
                }
            });
        },
        [updateField]
    );

    const startGame = (cellId) => {
        sendStartEvent(cellId);
        setGameStatus("In Progress...");
        sendPlayEvent(cellId, "reveal");
    };

    const joinGame = (gameId) => {
        setGameStatus("In Progress...");
        sendJoinEvent(gameId);
    };

    useEffect(() => {
        if (webSocket) {
            // webSocket events
            webSocket.addEventListener("message", (e) => {
                const message = JSON.parse(e.data);
                console.dir(message);

                if (message.action === "init") {
                    setGame(
                        message.gameId,
                        message.fieldSize,
                        message.gameDifficulty
                    );
                } else if (message.action === "move") {
                    receiveMoves(message);
                }
            });

            webSocket.addEventListener("close", (e) => {
                setWebSocket(null);
                setGameId(null);
                setGameStatus("Lost Connection");
            });
        }
    }, [webSocket, receiveMoves, setGame]);

    return (
        <section className="game">
            <Controls
                {...{
                    gameId,
                    gameStatus,
                    connectToServer,
                    fieldSize,
                    setField,
                    gameDifficulty,
                    setGameDifficulty,
                    joinGame,
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
