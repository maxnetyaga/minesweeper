import './Field.css';

export default function Field({ size }) {
  const cellsCount = size ** 2;
  const cells = [...Array(cellsCount).keys()].map((i) => <Cell key={i} dataKey={i} />);

  const fieldGridStyle = { 'grid-template-columns': `repeat(${size}, 1fr)`, 'grid-template-rows': `repeat(${size}, 1fr)` };

  return (
    <div className="Field" style={fieldGridStyle}>
      {cells}
    </div>
  );
}

function Cell({ dataKey }) {
  return <button className="Cell">{dataKey}</button>;
}
