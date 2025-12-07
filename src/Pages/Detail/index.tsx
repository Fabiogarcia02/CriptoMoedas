import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./detail.module.css"; // Se não tiver CSS ainda, remova essa linha

interface CoinProp {
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
}

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProp>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        const response = await fetch(`https://api.coincap.io/v2/assets/${cripto}`);
        const data = await response.json();

        if (data.error) {
           navigate("/"); // Se der erro, volta pra home
           return;
        }

        const priceFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
  
        const resultData = {
          ...data.data,
          formatedPrice: priceFormatter.format(Number(data.data.priceUsd)),
          formatedMarket: priceFormatter.format(Number(data.data.marketCapUsd)),
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
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1>{coin.name}</h1>
      <p>Preço: {coin.priceUsd}</p>
    </div>
  )
}