import { useRef, useState } from "react";

import "./JoinControl.css";

import { validateGameId } from "../../../utils/dataValidation";

export default function GameControl({ gameStatus, joinGame, gameId }) {
    const [isIdValid, setIsIdValid] = useState(true);

    const idInputRef = useRef();

    const joinButonClick = () => {
        const gameId = idInputRef.current.value;

        const isIdValid = validateGameId(gameId);
        setIsIdValid(isIdValid);

        if (!isIdValid) return;

        joinGame(gameId);
    };

    const isJoinControlDisables = gameStatus !== "Connected";

    return (
        <div className="control">
            <div className="control_header">Join control</div>
            <label>Game ID:</label>
            <input
                value={gameId}
                disabled={isJoinControlDisables}
                className={isIdValid ? "" : "invalid"}
                ref={idInputRef}
                name="game_id"
                id="game_id"
            />
            <button disabled={isJoinControlDisables} onClick={joinButonClick}>
                Join game
            </button>
        </div>
    );
}
