import './Field.css';
import Cell from './Cell';

export default function Field({ size }) {
  const cellsCount = size ** 2;
  const cells = [...Array(cellsCount).keys()].map((i) => <Cell key={i} />);

  const fieldGridStyle = { 'grid-template-columns': `repeat(${size}, 1fr)`, 'grid-template-rows': `repeat(${size}, 1fr)` };

  return (
    <div className="field" style={fieldGridStyle}>
      {cells}
    </div>
  );
}
