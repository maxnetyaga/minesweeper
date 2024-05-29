import './Header.css';
import logo from '../assets/logo.webp';

export default function Header({ pageName }) {
  return (
    <div className="headerWrapper">
      <header>
        <div className="pageName">
          <img src={logo} alt="Logo" />
          <h1>{pageName}</h1>
        </div>
      </header>
    </div>
  );
}
