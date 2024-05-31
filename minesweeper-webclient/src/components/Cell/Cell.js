import { useRef } from "react";

import "./Cell.css";

import cellBg1 from "../../assets/cells/1.png";
import cellBg2 from "../../assets/cells/2.png";
import cellBg3 from "../../assets/cells/3.png";
import cellBg4 from "../../assets/cells/4.png";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const CELL_BGS = [cellBg1, cellBg2, cellBg3, cellBg4];

export default function Cell({
    cellId,
    disabled,
    webSocket,
    gameStatus,
    setGameStatus,
    fieldSize,
    gameDifficulty,
}) {
    const cellBackground = useRef(CELL_BGS[getRandomInt(CELL_BGS.length)]);

    const revealCell = async (e) => {
        e.preventDefault();
        if (gameStatus === "Connected") {
            const event = {
                action: "start",
                fieldSize: fieldSize,
                gameDifficulty: gameDifficulty.toUpperCase(),
            };
            webSocket.send(JSON.stringify(event));
        }
    };

    const markCell = async (e) => {
        e.preventDefault();
    };

    return (
        <button
            disabled={disabled}
            style={{ backgroundImage: `url(${cellBackground.current})` }}
            className="cell"
            onClick={revealCell}
            onContextMenu={markCell}
        ></button>
    );
}
