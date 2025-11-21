import React, { useState, useEffect } from 'react';
import styles from './roleta.css';

const Roleta = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<{ code: string, title: string } | null>(null);
  const [showSpinButton, setShowSpinButton] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [thirdLayout, setThirdLayout] = useState(false);
  const [showRoletaContainer, setShowRoletaContainer] = useState(false);



  // Função para copiar o texto para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Código copiado!'))
      .catch((err) => console.error('Erro ao copiar texto: ', err));
  };

  useEffect(() => {
    const onSuccess = () => {
      setShowRoletaContainer(true)
      setShowSpinButton(true)
      setShowSidebar(true)

      const formElement = document.querySelector('.vtex-flex-layout-0-x-flexRow--row-form-roleta')
      if (formElement) {
        (formElement as HTMLElement).style.display = 'none'
      }
    }

    window.addEventListener("form-roleta-sucesso", onSuccess)

    return () => window.removeEventListener("form-roleta-sucesso", onSuccess)
  }, [])


  // Lista de prêmios fixos
  const prizes = [
    { code: 'BLACK50REAIS', title: 'Desconto R$50,00' },
    { code: 'BLACKENVELOPEG', title: 'Envelope G' },
    { code: 'BLACKCORDAO', title: 'Cordão' },
    { code: 'BLACKNECESSAIRE', title: 'Necessaire' },
    { code: 'BLACKSACOLA', title: 'Sacola' },
  ];

// Regras de prêmios atualizadas — BLACKFRETE removido e valores somados em BLACKSACOLA
const prizeRules: Record<string, { range: number[]; code: string }[]> = {
  '2025-11-21': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 62], code: 'BLACKSACOLA' },
  ],
  '2025-11-22': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 65], code: 'BLACKSACOLA' },
  ],
  '2025-11-23': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 69], code: 'BLACKSACOLA' },
  ],
  '2025-11-24': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 62], code: 'BLACKSACOLA' },
  ],
  '2025-11-25': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 57], code: 'BLACKSACOLA' },
  ],
  '2025-11-26': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 54], code: 'BLACKNECESSAIRE' },
    { range: [55, 63], code: 'BLACKSACOLA' },
  ],
  '2025-11-27': [
    { range: [1, 5], code: 'BLACK50REAIS' },
    { range: [6, 25], code: 'BLACKENVELOPEG' },
    { range: [26, 45], code: 'BLACKCORDAO' },
    { range: [46, 49], code: 'BLACKNECESSAIRE' },
    { range: [50, 81], code: 'BLACKSACOLA' },
  ],
  '2025-11-28': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 60], code: 'BLACKNECESSAIRE' },
    { range: [61, 81], code: 'BLACKSACOLA' },
  ],
  '2025-11-29': [
    { range: [1, 10], code: 'BLACK50REAIS' },
    { range: [11, 30], code: 'BLACKENVELOPEG' },
    { range: [31, 50], code: 'BLACKCORDAO' },
    { range: [51, 55], code: 'BLACKNECESSAIRE' },
    { range: [56, 71], code: 'BLACKSACOLA' },
  ],
  '2025-11-30': [
    { range: [1, 5], code: 'BLACK50REAIS' },
    { range: [6, 25], code: 'BLACKENVELOPEG' },
    { range: [26, 45], code: 'BLACKCORDAO' },
    { range: [46, 51], code: 'BLACKNECESSAIRE' },
    { range: [52, 62], code: 'BLACKSACOLA' },
  ],
};

    // Pega a data atual no formato YYYY-MM-DD (ajustada para o fuso horário local)
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  })
    .split('/')
    .reverse()
    .map((part, i) => (i === 1 ? part.padStart(2, '0') : part)) // garante zero à esquerda no mês
    .join('-');


    const getPrizeCode = (randomNumber: number): string => {
      const rules = prizeRules[currentDate as keyof typeof prizeRules];

      if (!rules) {
        const equalChanceIndex = Math.floor(Math.random() * prizes.length);
        const randomPrize = prizes[equalChanceIndex].code;
        console.log(`${currentDate} - range (igual) - ${randomPrize}`);
        return randomPrize;
      }

      // Garante que o número esteja dentro do range máximo
      const maxRange = Math.max(...rules.map((r) => r.range[1]));
      const adjustedNumber = Math.min(randomNumber, maxRange);

      // Busca o prêmio correspondente
      for (const rule of rules) {
        if (adjustedNumber >= rule.range[0] && adjustedNumber <= rule.range[1]) {
          console.log(`${currentDate} - número ${adjustedNumber} - range ${rule.range[0]},${rule.range[1]} - ${rule.code}`);
          return rule.code;
        }
      }

      // 🚨 Caso improvável: número não encontrado → retorna o último prêmio
      console.warn(`${currentDate} - número ${adjustedNumber} fora de todos os ranges. Retornando fallback.`);
      return rules[rules.length - 1].code; // fallback para BLACKSACOLA
    };



// Função principal da roleta
  const handleSpin = (): void => {
    if (!spinning && !hasSpun && prizes.length > 0) {
      setSpinning(true);
      setHasSpun(true);

      // Obtém o conjunto de regras do dia atual
      const rules = prizeRules[currentDate as keyof typeof prizeRules];

      // Calcula o valor máximo do range desse dia (ex: 35 no dia 30/11)
      const maxRange = rules ? Math.max(...rules.map((r) => r.range[1] || 0)) : prizes.length;

      // Sorteia o número dentro do range correto
      const randomNumber = Math.floor(Math.random() * maxRange) + 1;
      const prizeCode = getPrizeCode(randomNumber);

      // Ângulo do segmento de cada prêmio
      const segmentAngle = 360 / prizes.length;

      // Posição do prêmio sorteado
      const prizeIndex = prizes.findIndex((p) => p.code === prizeCode);

      // Ângulo necessário para alinhar o prêmio sorteado ao ponteiro
      const targetAngle = 360 * 4 - prizeIndex * segmentAngle;

      // Define a rotação final com alinhamento exato ao ponteiro
      setRotation(targetAngle);
      setSelectedPrize({ code: prizeCode, title: prizeCode });

      setTimeout(() => {
        setSpinning(false);
        setThirdLayout(true);
      }, 3000);
    }
  };




  return (
    <div className={styles.roletaContainer} style={{ display: showRoletaContainer ? 'block' : 'none' }}>
      <div className={`${styles.formularioRoleta} ${showSpinButton ? styles.oculto : ''}`}>
        {/* Conteúdo do formulário */}
      </div>

      {/* Tabela de Prêmios */}
      {!showSpinButton && (
        <div className={styles.prizeTable}>
          <h3>PRÊMIOS</h3>
          <table>
            <tbody>
              <tr>
                <td>FRETE GRÁTIS</td>
                <td>ENVELOPE 9x 23 CM</td>
              </tr>
              <tr>
                <td>ENVELOPE 5X13 CM</td>
                <td>PORTA ESMALTES</td>
              </tr>
              <tr>
                <td>BOX MAD.U</td>
                <td>VALE DESCONTO DE R$50</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.container}>
        {/* Div lateral */}
        {showSidebar && (
          <div className={styles.sidebar}>
            <img
              src="https://stermax.com.br/images_idealine/roleta/black-idealovers.webp"
              alt="Título Roleta Prêmios"
              className={styles.titleImage}
            />

            <div className={styles.conteinerTextos2Layout}>
              <div className={styles.conteinerTextos2LayoutTKS}>
                <p className={styles.textoTituloSegundaTela}>
                  ROLETA DE PRÊMIOS
                </p>
                <p className={styles.textoSubtituloSegundaTela}>
                  {thirdLayout
                    ? <span style={{ color: '#ffffff', fontSize: '12px'}}>
                      Parabéns! Agora é com você:
                    </span>
                    : "Agradecemos o seu Cadastro!"}
                </p>
              </div>
              <div className={styles.conteinerTextos2LayoutChegou}>
                <p>
                  {thirdLayout
                    ? selectedPrize && selectedPrize.code
                      ? (
                        <>
                          <span style={{ color: '#FC51A7', textShadow: 'none' }}>
                            Copie o seu cupom:<br /> {/* Quebra de linha aqui */}
                            &nbsp; {/* Texto adicional com espaço não quebrável */}
                          </span>
                          <span
                            onClick={() => copyToClipboard(selectedPrize.code.toUpperCase())}
                            style={{ cursor: 'pointer', color: '#FC51A7', textShadow: 'none', fontSize: '30px' }} // Estilo para indicar que é clicável
                          >
                            {selectedPrize.code.toUpperCase()} {/* Exibe o código do cupom */}
                            <ul className={styles.List}>
                              <li>Informe o código do cupom sorteado via Whatsapp.</li>
                              <li>Ou faça a compra diretamente aqui no site.</li>
                              <li>Preencha todos os dados para a compra, e o campo do cupom aparecerá na última etapa antes do pagamento.
                                Lembre-se de digitar em letras maiúsculas.
                              </li>
                            </ul>
                          </span>
                        </>
                      )
                      : "TENTE OUTRA VEZ" // ou uma mensagem apropriada
                    : "CHEGOU A HORA DE TESTAR A SUA SORTE"}
                </p>
              </div>
              <div className={styles.conteinerTextos2LayoutTorcendo}>
                <p className={thirdLayout ? styles.underline : ""}>
                  {thirdLayout ? "" : ""}
                </p>
              </div>
            </div>

            {/* Exibe a nova div somente no terceiro layout */}
            {thirdLayout && (
              <div className={styles.AgoraEhComVC}>


                {/* Botões de Compra */}
                <div className={styles.buttonContainer}>
                  <button
                      onClick={() => window.open('https://www.idealine.com.br/black-friday-idealine', '_blank')}
                      className={styles.siteButton}
                    >
                      COMPRAR PELO SITE E GARANTIR O MEU PRÊMIO
                      <img src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/50116347-19fb-4975-8f9a-04c257b26cc2___dd491c62ea310a7cd1e7499cd430814e.svg" alt="Ícone compra no site" className={styles.iconeSacola} />
                  </button>
                  <button
                      onClick={() => {
                        if (selectedPrize) {
                          const prizeCode = encodeURIComponent(selectedPrize.code.toUpperCase());
                          window.open(
                            `https://api.whatsapp.com/send?phone=5541998516332&text=Ol%C3%A1%2C%20tudo%20bem%3F%20Ganhei%20o%20pr%C3%AAmio%20${prizeCode}%20na%20roleta%20e%20quero%20falar%20com%20uma%20consultora%20para%20garantir%20meu%20cupom.%20%F0%9F%A4%A9`,
                            '_blank'
                          );
                        }
                      }}

                    className={styles.whatsappButton}
                  >
                    COMPRAR COM CONSULTORA E GARANTIR O MEU PRÊMIO
                    <img src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/033385b4-ec2e-4b80-b824-91b5d979c897___54e571574de08cf410c2541050bd7141.svg" alt="Ícone whatsapp" className={styles.whatsConsultoras} />
                  </button>


                </div>
              </div>
            )}

            {showSpinButton && !thirdLayout && (
              <div className={styles.spinButtonContainer}>
                <button
                  onClick={handleSpin}
                  className={`${styles.spinButton} ${selectedPrize ? styles.pulsatingButton : ''}`}
                  disabled={spinning || hasSpun}
                >
                  {spinning ? 'Girando...' : selectedPrize ? selectedPrize.code : 'Girar a Roleta'}
                </button>
              </div>
            )}
            <div className={styles.conteinerTextos2LayoutImgMera}>
              <p>*Imagens de prêmios meramente ilustrativas</p>
            </div>
          </div>
        )}

        {/* Div da roleta */}
        <div className={styles.wheelContainer}>
          <img
            src="https://stermax.com.br/images_idealine/roleta/pointer.webp"
            alt="Ponteiro"
            className={`${styles.pointer} ${spinning ? styles.pointerVibrate : ''}`}
          />
          <div className={styles.wheel} style={{ transform: `rotate(${rotation}deg)` }}>
            <img
              src="https://stermax.com.br/images_idealine/roleta/roleta-app-custom.webp"
              alt="Imagem da roleta"
              className={styles.wheelImage}
            />
            {/* Distribuição circular dos prêmios */}
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={styles.segmentText}
                style={{
                  transform: `rotate(${index * (360 / prizes.length)}deg)`,
                }}
              >
                <span className={styles.segmentText}>{prize.title}</span>
              </div>
            ))}
          </div>
          {/* Aqui adicionamos o texto abaixo da roleta no terceiro layout */}
          {thirdLayout && selectedPrize && (
            <div className={styles.couponMessage}>
              <p>
                {/* Você <strong>GANHOU o CUPOM <span onClick={() => copyToClipboard(selectedPrize.code.toUpperCase())} style={{ cursor: 'copy' }}>
                            {selectedPrize.code.toUpperCase()}
                            </span></strong> */}
                Cupom válido nas compras acima de R$ 390 reais.
              </p>
              <p>Válido apenas um prêmio por CPF.</p>
              <p>Estoque de prêmios limitado, sujeito à disponibilidade no momento da compra.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roleta;
