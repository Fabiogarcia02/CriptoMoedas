import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./detail.module.css"; 

interface CoinProp {
  symbol: string;
  name: string;
  price: string;
  marketCap: string;
  low_24h: string;
  high_24h: string;
  totalVolume: string;
  delta_24h: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedLow: string;
  formatedHigh: string;
  image: string; // Adicionamos a imagem
}

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProp>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        // Usando a API da CoinGecko para manter consistência com a Home
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cripto}`);
        const data = await response.json();

        if (data.error) {
           navigate("/"); 
           return;
        }

        const priceFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const compactFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const resultData = {
          symbol: data.symbol,
          name: data.name,
          image: data.image?.large, // Pega imagem grande para detalhes
          price: data.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          low_24h: data.market_data.low_24h.usd,
          high_24h: data.market_data.high_24h.usd,
          totalVolume: data.market_data.total_volume.usd,
          delta_24h: data.market_data.price_change_percentage_24h,
          
          formatedPrice: priceFormatter.format(data.market_data.current_price.usd),
          formatedMarket: compactFormatter.format(data.market_data.market_cap.usd),
          formatedLow: priceFormatter.format(data.market_data.low_24h.usd),
          formatedHigh: priceFormatter.format(data.market_data.high_24h.usd),
        }

        setCoin(resultData);
        setLoading(false);

      } catch(err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto, navigate]);

  if(loading || !coin){
    return (
        <div className={styles.container}>
            <h4 className={styles.center}>Carregando detalhes...</h4>
        </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin.name}</h1>
      <h3 className={styles.center}>{coin.symbol.toUpperCase()}</h3>

      <section className={styles.content}>
        <img 
            src={coin.image} 
            alt={coin.name} 
            className={styles.logo}
        />

        <h1>{coin.name} | {coin.symbol.toUpperCase()}</h1>
        
        <p><strong>Preço atual:</strong> {coin.formatedPrice}</p>

        {/* Lógica para cor verde/vermelha na variação */}
        <p>
            <strong>Variação 24h: </strong>
            <span className={Number(coin.delta_24h) >= 0 ? styles.profit : styles.loss}>
                {Number(coin.delta_24h).toFixed(2)}%
            </span>
        </p>

        <div className={styles.grid}>
            <div className={styles.card}>
                <span>Menor preço 24h</span>
                <strong>{coin.formatedLow}</strong>
            </div>
            
            <div className={styles.card}>
                <span>Maior preço 24h</span>
                <strong>{coin.formatedHigh}</strong>
            </div>

            <div className={styles.card}>
                <span>Valor de Mercado</span>
                <strong>{coin.formatedMarket}</strong>
            </div>
        </div>

      </section>
    </div>
  )
}