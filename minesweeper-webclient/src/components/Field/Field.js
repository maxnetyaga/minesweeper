import "./Field.css";
import Cell from "../Cell/Cell";

export default function Field({
    fieldSize,
    webSocket,
    gameStatus,
    setGameStatus,
    gameDifficulty,
}) {
    const cellsCount = fieldSize ** 2;
    const cells = [...Array(cellsCount).keys()].reduce((cells, cellId) => {
        cells[cellId] = (
            <Cell
                key={cellId}
                cellId={cellId}
                disabled={!webSocket}
                webSocket={webSocket}
                gameStatus={gameStatus}
                setGameStatus={setGameStatus}
                fieldSize={fieldSize}
                gameDifficulty={gameDifficulty}
            />
        );
        return cells;
    }, {});

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
