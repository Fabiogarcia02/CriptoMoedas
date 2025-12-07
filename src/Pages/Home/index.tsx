import { useEffect, useState, type FormEvent } from "react";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import "../../index.css";

interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  marketCapUsd: string;
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [coins, setCoins] = useState<CoinProps[]>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await fetch(
        "https://rest.coincap.io/v3/assets?limit=10&offset=0"
      );
      const json: DataProp = await response.json();

      setCoins(json.data);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;

    navigate(`/Detail/${input.toLowerCase()}`);
  }

  function mostramais() {
    console.log("Carregar mais...");
    // Aqui depois você implementa carregar mais páginas
  }

  // Formatter para valores
  const formatUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda"
          value={input}
          onChange={(event) => setInput(event.target.value)}
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
          {coins.map((coin) => (
            <tr key={coin.id} className={styles.tr}>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <Link to={`/Detail/${coin.id}`}>
                    <span>{coin.name}</span> | {coin.symbol.toUpperCase()}
                  </Link>
                </div>
              </td>

              <td data-label="Valor Mercado">
                {formatUSD.format(Number(coin.marketCapUsd))}
              </td>

              <td data-label="Preço">
                {formatUSD.format(Number(coin.priceUsd))}
              </td>

              <td data-label="Volume">
                {formatUSD.format(Number(coin.vwap24Hr))}
              </td>

              <td
                className={
                  Number(coin.changePercent24Hr) >= 0
                    ? styles.tdProfit
                    : styles.tdLoss
                }
                data-label="Mudança 24h"
              >
                <span>
                  {Number(coin.changePercent24Hr).toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={mostramais} className={styles.buttonMore}>
        Carregar mais
      </button>
    </main>
  );
}
