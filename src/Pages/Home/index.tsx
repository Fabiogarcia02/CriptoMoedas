import type { FormEvent } from "react";
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Interface dos dados que vem da API e dados formatados
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
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Controller para cancelar a requisição se o componente for desmontado
    const controller = new AbortController();

    async function getData() {
      // Se não tem mais itens e não é a primeira carga, para a função.
      if (!hasMore && offset > 0) {
          setLoading(false);
          return;
      }

      setLoading(true);

      try {
        // 2. URL CORRIGIDA (V2) e Header de Autorização
        const url = `https://api.coincap.io/v2/assets?limit=10&offset=${offset}`;
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "Authorization": "Bearer 8b723aacc524a272060785525ee6d6a70babbe542f4ce3f294d58bb7583b6727"
            }
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data: DataProp = await response.json();
        const coinsData = data.data;

        // Se a lista vier vazia, significa que acabou a paginação
        if (coinsData.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Configuração dos formatadores de moeda
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

        // Formata os dados recebidos
        const formatted = coinsData.map((item) => ({
          ...item,
          formatedPrice: priceFormatter.format(Number(item.priceUsd) || 0),
          formatedMarket: compactFormatter.format(Number(item.marketCapUsd) || 0),
          formatedVolume: compactFormatter.format(Number(item.volumeUsd24Hr) || 0),
        }));

        // 3. ATUALIZA O ESTADO COM PROTEÇÃO CONTRA DUPLICATAS
        setCoins((prevCoins) => {
            const existingIds = new Set(prevCoins.map(coin => coin.id));
            // Filtra apenas as moedas que ainda não temos na lista
            const newCoins = formatted.filter(coin => !existingIds.has(coin.id));
            return [...prevCoins, ...newCoins];
        });

      } catch (error) {
         // Ignora erros de cancelamento (quando o usuário sai da página rápido)
         if (error instanceof Error && error.name !== 'AbortError') {
            console.error("Erro ao carregar dados:", error);
         }
      } finally {
        setLoading(false);
      }
    }

    getData();

    // Cleanup function do useEffect
    return () => {
        controller.abort();
    }
  }, [offset, hasMore]); // Array de dependências

  // Função para buscar moeda pelo input
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const searchInput = input.trim();
    if (searchInput === "") return;
    navigate(`/detail/${searchInput}`);
  }

  // Função para carregar mais itens (Paginação)
  function handleGetMore() {
    if (!loading && hasMore) {
        setOffset((prev) => prev + 10);
    }
  }

  // Tratamento de erro caso a imagem da moeda não exista
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none'; 
  };

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
          {coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img
                    className={styles.logo}
                    alt={`${item.name} logo`}
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
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
                <span>{Number(item.changePercent24Hr).toFixed(3)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Exibição do botão carregar mais ou mensagens de status */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        {loading && offset === 0 && <p>Carregando lista...</p>}
        
        {!loading && hasMore && coins.length > 0 && (
            <button className={styles.buttonMore} onClick={handleGetMore}>
                Carregar mais
            </button>
        )}
        
        {loading && offset > 0 && <p>Carregando mais moedas...</p>}
        
        {!hasMore && coins.length > 0 && <p>Fim da lista.</p>}
      </div>

    </main>
  );
}