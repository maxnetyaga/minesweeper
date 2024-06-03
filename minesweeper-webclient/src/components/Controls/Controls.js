import "./Controls.css";

import ServerControl from "./ConnectionControl/ServerControl";
import GameControl from "./GameControl/GameControl";
import JoinControl from "./JoinControl/JoinControl";

export default function Controls({
    gameId,
    gameStatus,
    connectToServer,
    fieldSize,
    setField,
    gameDifficulty,
    setGameDifficulty,
}) {
    return (
        <div className="control_box">
            <ServerControl {...{ gameStatus, connectToServer }} />
            <GameControl
                {...{
                    gameId,
                    gameStatus,
                    fieldSize,
                    setField,
                    gameDifficulty,
                    setGameDifficulty,
                }}
            />
            <JoinControl />
        </div>
    );
}
