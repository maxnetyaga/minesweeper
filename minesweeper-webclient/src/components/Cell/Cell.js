import { useRef, useState } from "react";

import "./Cell.css";

import { config } from "../../config";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const CELL_HIDDEN_BGS = config.cellBackgrounds;
const CELL_REVEALED_BGS = config.cellRevealedTextures;
const CELL_MARKED_BG = config.cellMarkedTexture;
const CELL_BOMB_BG = config.cellBombTexture;

export default function Cell({
    id,
    status,
    gameStatus,
    startGame,
    sendPlayEvent,
}) {
    const cellHiddenBgRef = useRef(
        CELL_HIDDEN_BGS[getRandomInt(CELL_HIDDEN_BGS.length)]
    );

    const getBgImage = () => {
        let bgPath;

        switch (status?.state) {
            case "revealed": {
                bgPath = CELL_REVEALED_BGS[status.value];
                break;
            }
            case "marked": {
                bgPath = CELL_MARKED_BG;
                break;
            }
            case "exploded": {
                bgPath = CELL_BOMB_BG;
                break;
            }
            default:
                bgPath = cellHiddenBgRef.current;
                break;
        }

        return `url(${bgPath})`;
    };

    const cellBg = getBgImage();

    const revealCell = (e) => {
        e.preventDefault();

        if (gameStatus === "Connected") {
            startGame(id);
        }

        if (gameStatus === "In Progress...") {
            sendPlayEvent(id, "reveal");
        }
    };

    const markCell = async (e) => {
        e.preventDefault();

        if (gameStatus === "In Progress...") {
            let event;
            if (!status || status.state === "hidden") {
                event = "mark";
            } else if (status?.state === "marked") {
                event = "unmark";
            } else return;

            sendPlayEvent(id, event);
        }
    };

    if (status?.state === "revealed") {
        
    }

    return (
        <button
            disabled={!["Connected", "In Progress..."].includes(gameStatus)}
            style={{ backgroundImage: cellBg }}
            className="cell"
            onClick={revealCell}
            onContextMenu={markCell}
        ></button>
    );
}
