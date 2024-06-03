import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import "./Cell.css";

import { config } from "../../config";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const CELL_HIDDEN_BGS = config.cellBackgrounds;
const CELL_REVEALED_BGS = config.cellRevealedTextures;
const CELL_MARKED_BG = config.cellMarkedTexture;
const CELL_BOMB_BG = config.cellBombTexture;

const wrapInUrl = (path) => {
    return `url(${path})`;
};

const getCellBg = (state, value) => {
    let bgPath;

    switch (state) {
        case "revealed": {
            bgPath = CELL_REVEALED_BGS[value];
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
            break;
    }

    return bgPath;
};

export default function Cell({
    id,
    state,
    value,
    gameStatus,
    startGame,
    sendPlayEvent,
}) {
    const btnRef = useRef(null);

    const cellDefBg = useRef(
        CELL_HIDDEN_BGS[getRandomInt(CELL_HIDDEN_BGS.length)]
    ).current;

    const cellBg = getCellBg(state, value) || cellDefBg;

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
            if (!state || state === "hidden") {
                event = "mark";
            } else if (state === "marked") {
                event = "unmark";
            } else return;

            sendPlayEvent(id, event);
        }
    };

    if (state === "revealed") {
    }

    return (
        <CSSTransition
            nodeRef={btnRef}
            in={state !== "hidden"}
            timeout={500}
            classNames={"cell"}
        >
            <button
                ref={btnRef}
                disabled={!["Connected", "In Progress..."].includes(gameStatus)}
                style={{ backgroundImage: wrapInUrl(cellBg) }}
                className="cell"
                onClick={revealCell}
                onContextMenu={markCell}
            />
        </CSSTransition>
    );
}
