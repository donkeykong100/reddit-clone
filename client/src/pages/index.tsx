import { useAuthState } from "../context/auth";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
