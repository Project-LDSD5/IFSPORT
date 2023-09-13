import { Link } from "react-router-dom";
import Container from "./Container";
import styles from "./Navbar.module.css";
import logo from "../../img/teste.png";

function Navbar() {
  return (
    <div className={styles.navbar}>
      <Container>
        <Link to="/">
          <img className={styles.img} src={logo} alt="Costs" />
        </Link>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.item}>
            <Link to="/projects">Eventos</Link>
          </li>
          <li className={styles.item}>
            <Link to="/company">Esporte</Link>
          </li>
          <li className={styles.item}>
            <Link to="/contact">Contato</Link>
          </li>
          <Link to="/cadastro">
              <button className={styles.btn}>Cadastre-se</button>
            </Link>
            <Link to="/login">
              <button className={styles.btn}>Login</button>
            </Link>
        </ul>
      </Container>
    </div>
  );
}

export default Navbar;