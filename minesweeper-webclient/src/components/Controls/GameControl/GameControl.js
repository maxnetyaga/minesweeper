import { useState } from "react";

import "./GameControl.css";

import { config } from "../../../config";

export default function GameControl({
    gameId,
    gameStatus,
    fieldSize,
    setFieldSize,
    gameDifficulty,
    setGameDifficulty,
}) {
    const [inputFieldSize, setInputFieldSize] = useState(fieldSize);
    const isControlDisabled = gameStatus === "In Progress...";

    const changeFieldSize = (e) => {
        let newSize = e.target.value;
        setInputFieldSize(newSize);
        newSize = Number(newSize);

        if (
            !(newSize >= config.minFieldSize && newSize <= config.maxFieldSize)
        ) {
            setFieldSize(null);
        } else {
            setFieldSize(newSize);
        }
    };

    return (
        <div className="control">
            <div className="control_header">Game control</div>
            <label>Field Size:</label>
            <input
                disabled={isControlDisabled}
                className={fieldSize ? "" : "invalid"}
                value={inputFieldSize}
                onChange={changeFieldSize}
                name="field_size"
                id="field_size"
            ></input>

            <label>Difficulty:</label>
            <select
                disabled={isControlDisabled}
                value={gameDifficulty}
                onChange={(e) => setGameDifficulty(e.target.value)}
                name="difficulty"
                id="difficulty"
            >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="EXPERT">Expert</option>
            </select>
            <div className="game_id">Game ID: {gameId}</div>
        </div>
    );
}
