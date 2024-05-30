import './ServerControl.css';
import { useContext, useRef, useState } from 'react';
import { WebSocketContext } from '../../Game/Game';

const validateIpv4 = (ip) => {
  const ipPattern = new RegExp(
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  );
  return ipPattern.test(ip);
};

const validatePort = (port) => {
  port = Number(port);
  return port >= 1 && port <= 65535;
};

const waitForOpenConnection = (socket) => {
  return new Promise((resolve, reject) => {
    const maxNumberOfAttempts = 3;
    const intervalTime = 200; //ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval);
        reject(new Error('Maximum number of attempts exceeded'));
      } else if (socket.readyState === socket.OPEN) {
        clearInterval(interval);
        resolve();
      }
      currentAttempt++;
    }, intervalTime);
  });
};

export default function ServerControl() {
  const { setWebSocket } = useContext(WebSocketContext);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isIpValid, setIsIpValid] = useState(true);
  const [isPortValid, setIsPortValid] = useState(true);

  const ipInputRef = useRef();
  const portInputRef = useRef();

  const createWebSocket = async (ip, port) => {
    const ws = new WebSocket(`ws://${ip}:${port}`);
    try {
      await waitForOpenConnection(ws);
    } catch {
      return null;
    }
    return ws;
  };

  const tryConnect = async () => {
    const ip = ipInputRef.current.value;
    const port = portInputRef.current.value;
    const isIpValid = validateIpv4(ip);
    const isPortValid = validatePort(port);
    setIsIpValid(isIpValid);
    setIsPortValid(isPortValid);
    if (!isIpValid || !isPortValid) return;

    const ws = await createWebSocket(ip, port);
    if (!ws) {
      setConnectionStatus('Server is unreachable');
      return;
    }
    setWebSocket(ws);
    setConnectionStatus('Connected');
  };

  return (
    <div className="control">
      <label>Server IPv4</label>
      <input
        disabled={connectionStatus === 'Connected'}
        className={isIpValid ? '' : 'invalid'}
        ref={ipInputRef}
        name="ipv4"
        placeholder="x.x.x.x"
        id="ipv4"
        type="text"
      ></input>
      <label>Server Port</label>
      <input
        disabled={connectionStatus === 'Connected'}
        className={isPortValid ? '' : 'invalid'}
        ref={portInputRef}
        name="port"
        placeholder="8080"
        id="port"
        type="text"
      ></input>
      <button disabled={connectionStatus === 'Connected'} onClick={tryConnect}>
        Connect to server
      </button>
      <div className="connection_status">{connectionStatus}</div>
    </div>
  );
}
