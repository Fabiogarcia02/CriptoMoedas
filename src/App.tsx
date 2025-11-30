import { useState } from 'react'
import './App.css'
import logoImg  from './assets/logo.png'

function App() {

  const [textoFrase, setTextoFrase] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);

  const todasAsfrases = [
    {
      id: 1,
      nome: "Motivação",
      frases: [
        'Siga os bons e aprenda com eles.',
        'O bom senso vale mais que muito conhecimento',
        'Não são os grandes planos que dão certo. São as pequenas coisas bem feitas, dia após dia.',
        'O que você planta hoje definirá a sombra em que descansará amanhã.',
        'Vencedores não são pessoas que nunca falham, são pessoas que nunca desistem.',
        'A primeira e melhor vitória é conquistar-se a si mesmo.',
      ]
    },
    {
      id: 2,
      nome: "Bom dia",
      frases: [
        'Bom dia! Que sua jornada hoje seja leve e cheia de boas surpresas.',
        'Que o seu dia comece com paz e termine com conquistas.',
        'Bom dia! Que cada pequena ação de hoje te leve mais perto dos seus sonhos.',
        'Que a luz deste dia ilumine seus passos e fortaleça sua coragem.',
        'Bom dia! Sorria, a vida sempre retribui quem espalha coisas boas.',
        'Que hoje seja um dia de bênçãos, crescimento e boas escolhas.',
        'Bom dia! Acredite: coisas incríveis podem acontecer a qualquer momento.',
        'Que seu dia seja tão especial quanto a sua melhor intenção.',
        'Bom dia! Que a paz te acompanhe e a alegria faça morada.',
        'Hoje é uma nova chance de fazer o que ontem parecia difícil. Tenha um ótimo dia!',
      ]
    }
  ];

  function handleEscolhacategoria(index: number) {
    console.log('categoria clicada:', index, todasAsfrases[index]?.nome);
    setCategoriaSelecionada(index);
    setTextoFrase(""); 
  }

  function gerarFrase() {
    // Proteção: verifica se existe a categoria e se tem frases
    const categoria = todasAsfrases[categoriaSelecionada];
    if (!categoria) {
      console.warn('Categoria inválida:', categoriaSelecionada);
      return;
    }
    const frasesDaCategoria = categoria.frases ?? [];
    if (frasesDaCategoria.length === 0) {
      console.warn('Categoria sem frases:', categoria.nome);
      return;
    }

    const aleatorio = Math.floor(Math.random() * frasesDaCategoria.length);
    console.log('índice aleatório:', aleatorio);
    setTextoFrase(frasesDaCategoria[aleatorio]);
  }

  return (
    <div className='container'>
      <img className='logo' src={logoImg} alt="logo" />
      <h2 className='titulo'>Categorias</h2>

      <section className='area-botao'>
        {todasAsfrases.map((item, index) => {
          return (
            <button
              type="button"                         
              className='categoriabotao'
              key={item.id}
              style={{
                borderWidth: index === categoriaSelecionada ? 2 : 0,
                borderColor: "#1fa4db"
              }}
              onClick={() => handleEscolhacategoria(index)}
            >
              {item.nome}
            </button>
          );
        })}
      </section>

      <button
        type="button"       
        className='botao-frase'
        onClick={gerarFrase}
      >
        Gerar Frases
      </button>

      {textoFrase !== '' &&
        <h2 className='texto-frase'>{textoFrase}</h2>
      }
    </div>
  );
}

export default App;
