import { useEffect, useState } from "react";

import "./GameControl.css";

import { config } from "../../../config";

export default function GameControl({
    gameId,
    gameStatus,
    fieldSize,
    setField,
    gameDifficulty,
    setGameDifficulty,
}) {
    const [inputFieldSize, setInputFieldSize] = useState(fieldSize);

    const changeFieldSize = (e) => {
        const inputValue = e.target.value;
        setInputFieldSize(inputValue);

        if (
            inputValue < config.minFieldSize ||
            inputValue > config.maxFieldSize
        )
            return;
        setField(inputValue);
    };

    const isGameControlDisabled =
        gameStatus !== "Connected" || gameStatus === "In Progress...";

    useEffect(() => {
        setInputFieldSize(fieldSize);
    }, [fieldSize]);

    return (
        <div className="control">
            <div className="control_header">Game control</div>
            <label>Field Size:</label>
            <input
                disabled={isGameControlDisabled}
                className={fieldSize === inputFieldSize ? "" : "invalid"}
                value={inputFieldSize}
                onChange={changeFieldSize}
                name="field_size"
                id="field_size"
            ></input>

            <label>Difficulty:</label>
            <select
                disabled={isGameControlDisabled}
                value={gameDifficulty.toUpperCase()}
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
