import "./Field.css";

import Cell from "../Cell/Cell";

export default function Field({
    field,
    fieldSize,
    gameStatus,
    startGame,
    sendPlayEvent,
}) {
    const cells = [...field.entries()].map((cell) => {
        const cellId = cell[0];
        const cellStatus = cell[1] || { state: "hidden", value: undefined };
        return (
            <Cell
                key={cellId}
                id={cellId}
                {...cellStatus}
                {...{ field, gameStatus, startGame, sendPlayEvent }}
            />
        );
    });

    const fieldGridStyle = {
        "grid-template-columns": `repeat(${fieldSize}, 1fr)`,
        "grid-template-rows": `repeat(${fieldSize}, 1fr)`,
    };

    return (
        <div className="field" style={fieldGridStyle}>
            {Object.values(cells)}
        </div>
    );
}
