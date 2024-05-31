import "./Controls.css";

import ServerControl from "./ConnectionControl/ServerControl";
import GameControl from "./GameControl/GameControl";

export default function Controls({
    gameId,
    gameStatus,
    connectToServer,
    fieldSize,
    setFieldSize,
    gameDifficulty,
    setGameDifficulty,
}) {
    return (
        <div className="control_box">
            <ServerControl {...{ gameStatus, connectToServer }} />
            <GameControl
                {...{
                    gameId,
                    fieldSize,
                    setFieldSize,
                    gameDifficulty,
                    setGameDifficulty,
                }}
            />
        </div>
    );
}
