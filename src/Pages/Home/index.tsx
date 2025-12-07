import type { FormEvent } from "react";
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string | null;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
  image?: string; // 1. Adicionado campo para imagem correta
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (!hasMore && offset > 1) return;

      setLoading(true);

      try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${offset}&sparkline=false`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
           throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
          setHasMore(false);
          setLoading(false);
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
          maximumFractionDigits: 1,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted: CoinProps[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol.toUpperCase(),
          priceUsd: String(item.current_price),
          vwap24Hr: "0",
          changePercent24Hr: String(item.price_change_percentage_24h),
          rank: String(item.market_cap_rank),
          supply: String(item.circulating_supply),
          maxSupply: item.total_supply ? String(item.total_supply) : null,
          marketCapUsd: String(item.market_cap),
          volumeUsd24Hr: String(item.total_volume),
          explorer: null,
          formatedPrice: priceFormatter.format(item.current_price),
          formatedMarket: compactFormatter.format(item.market_cap),
          formatedVolume: compactFormatter.format(item.total_volume),
          image: item.image // 2. Pegando a imagem direto da API
        }));

        setCoins((prevCoins) => {
            const existingIds = new Set(prevCoins.map(coin => coin.id));
            const newCoins = formatted.filter(coin => !existingIds.has(coin.id));
            return [...prevCoins, ...newCoins];
        });

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();

  }, [offset]); 

  // --- LÓGICA DE BUSCA IMPLEMENTADA ---
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const searchInput = input.trim();
    
    if (searchInput === "") return;

    // 3. Importante: CoinGecko só aceita IDs minúsculos (ex: 'bitcoin', não 'Bitcoin')
    // Ao dar Enter, ele navega para a página de detalhes daquela moeda específica
    navigate(`/detail/${searchInput.toLowerCase()}`);
  }

  function handleGetMore() {
    if (!loading && hasMore) {
        setOffset((prev) => prev + 1);
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none'; 
  };

  // 4. Filtro Local: Filtra as moedas QUE JÁ ESTÃO NA TELA enquanto digita
  const displayedCoins = coins.filter(coin => 
      coin.name.toLowerCase().includes(input.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... EX: bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody>
          {/* 5. Usamos 'displayedCoins' em vez de 'coins' para o filtro funcionar */}
          {displayedCoins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img
                    className={styles.logo}
                    alt={`${item.name} logo`}
                    // 6. Usando a imagem correta que vem da API
                    src={item.image} 
                    onError={handleImageError}
                  />

                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>
              <td className={styles.tdLabel} data-label="Valor mercado">
                {item.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {item.formatedPrice}
              </td>
              <td className={styles.tdLabel} data-label="Volume">
                {item.formatedVolume}
              </td>
              <td
                className={
                  Number(item.changePercent24Hr) > 0
                    ? styles.tdProfit
                    : styles.tdLoss
                }
                data-label="Mudança 24h"
              >
                <span>{Number(item.changePercent24Hr).toFixed(2)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mensagem caso o filtro local não ache nada */}
      {displayedCoins.length === 0 && coins.length > 0 && (
         <p style={{textAlign:'center', marginTop: 20}}>
            Nenhuma moeda encontrada na lista atual. Aperte Enter para buscar na API.
         </p>
      )}

      {loading && <p style={{textAlign: 'center'}}>Carregando moedas...</p>}
      
      {!loading && hasMore && displayedCoins.length > 0 && (
        <button className={styles.buttonMore} onClick={handleGetMore}>
            Carregar mais
        </button>
      )}
    </main>
  );
}