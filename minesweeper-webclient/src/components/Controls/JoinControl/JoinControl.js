import "./JoinControl.css";

export default function GameControl() {
    return (
        <div className="control">
            <div className="control_header">Join control</div>
            <label>Game ID:</label>
            <input name="game_id" id="game_id"></input>
            <button>Join to game</button>
        </div>
    );
}
