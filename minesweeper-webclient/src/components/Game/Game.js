import './Game.css';
import Field from '../Field/Field';
import Controls from '../Controls/Controls';
import { createContext, useEffect, useState } from 'react';

const FIELD_SIZE = 24;
export const WebSocketContext = createContext({
  webSocket: null,
  setWebSocket: () => {},
});

export function Game() {
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (webSocket) {
      webSocket.send(JSON.stringify('Hello'));
    }
  }, [webSocket]);

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      <section className="game">
        <Controls />
        <Field size={FIELD_SIZE} />
      </section>
    </WebSocketContext.Provider>
  );
}
