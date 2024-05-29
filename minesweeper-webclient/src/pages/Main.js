import './Main.css';
import '../components/Field';
import Field from '../components/Field';

const FIELD_SIZE = 20;

export default function Main() {
  return (
    <div className="Main">
      <Field size={FIELD_SIZE} />
    </div>
  );
}
