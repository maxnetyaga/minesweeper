import './Cell.css';
import cellBg1 from '../../assets/cells/1.png';
import cellBg2 from '../../assets/cells/2.png';
import cellBg3 from '../../assets/cells/3.png';
import cellBg4 from '../../assets/cells/4.png';
import { useEffect, useRef } from 'react';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const CELL_BGS = [cellBg1, cellBg2, cellBg3, cellBg4];

function handleCellLeftClick(e) {
  console.dir(e);
  e.preventDefault();
}

function hadnleCellRightClick(e) {
  e.preventDefault();
}

export default function Cell() {
  const btnRef = useRef(null);

  // setting cell background only on mount
  useEffect(() => {
    btnRef.current.style.background = `no-repeat, url(${CELL_BGS[getRandomInt(CELL_BGS.length)]})`;
  }, []);

  return <button ref={btnRef} className="cell" onClick={handleCellLeftClick} onContextMenu={hadnleCellRightClick}></button>;
}
