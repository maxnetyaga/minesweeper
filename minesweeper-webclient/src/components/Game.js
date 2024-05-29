import './Game.css';
import Field from './Field';

const FIELD_SIZE = 18;

export default function Game() {
  return (
    <section className="game">
      <Field size={FIELD_SIZE} />
    </section>
  );
}
