import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from './home.module.css'
import "../../index.css";

export function Home() {
    return (
        <main className={styles.container}>

            <form className={styles.form}>
                <input
                    type="text"
                    placeholder="Digite o nome da moeda"
                />
                <button type="submit">
                    <BsSearch size={30} color="#FFF" />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Moeda</th>
                        <th>Valor Mercado</th>
                        <th>Preço</th>
                        <th>Volume</th>
                        <th>Mudança 24h</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className={styles.tr}>

                        <td className={styles.tdLabel} data-label="Moeda">
                            <div className={styles.name}>
                                <Link to="/Detail/bitcoin">
                                    <span>Bitcoin</span> | BTC
                                </Link>
                            </div>
                        </td>

                        <td className={styles.tdLabel} data-label="Valor Mercado">
                            1T
                        </td>

                        <td className={styles.tdLabel} data-label="Preço">
                            6.000
                        </td>

                        <td className={styles.tdLabel} data-label="Volume">
                            2B
                        </td>

                        <td className={styles.tdProfit} data-label="Mudança 24h">
                            <span>1.20%</span>
                        </td>

                    </tr>
                </tbody>
            </table>

        </main>
    );
}
