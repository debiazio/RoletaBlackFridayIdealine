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
  const [showRoletaContainer, setShowRoletaContainer] = useState(false); // Novo estado para controlar a visibilidade do container

  // Função para copiar o texto para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Código copiado!'))
      .catch((err) => console.error('Erro ao copiar texto: ', err));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const successMessage = document.querySelector('.vtex-rich-text-0-x-paragraph--confirm-form-roleta');
      if (successMessage) {
        setShowRoletaContainer(true); // Exibe o container da roleta quando a classe aparece
        setShowSpinButton(true);
        setShowSidebar(true);
        clearInterval(interval);

        const formElement = document.querySelector('.vtex-flex-layout-0-x-flexRow--row-form-roleta');
        if (formElement) {
          (formElement as HTMLElement).style.display = 'none';
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [hasSpun]);

  // Lista de prêmios fixos
  const prizes = [
    { code: 'blackenvelopeg', title: 'Env. G' },
    { code: 'black50reais', title: 'R$50' },
    { code: 'blackpinkbox', title: 'BOX' },
    { code: 'blackesmalteira', title: 'P. Esmaltes' },
    { code: 'blackenvelopep', title: 'Env. P' },
    { code: 'blackfrete', title: 'Frete' },
  ];

  // Regras de prêmios por data
  const prizeRules: Record<string, { range: number[]; code: string }[]> = {
    // hoje para testes
    '2024-11-03': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 64], code: 'blackenvelopeg' },
      { range: [65, 70], code: 'blackpinkbox' },
      { range: [71, 73], code: 'blackesmalteira' },
      { range: [74, 75], code: 'black50reais' },
      { range: [76, 77], code: 'blackfrete' },
    ],
    '2024-11-04': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 64], code: 'blackenvelopeg' },
      { range: [65, 70], code: 'blackpinkbox' },
      { range: [71, 73], code: 'blackesmalteira' },
      { range: [74, 75], code: 'black50reais' },
      { range: [76, 77], code: 'blackfrete' },
    ],
    '2024-11-05': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 69], code: 'blackpinkbox' },
      { range: [70, 72], code: 'blackesmalteira' },
      { range: [73, 76], code: 'black50reais' },
      { range: [77, 81], code: 'blackfrete' },
    ],
    '2024-11-06': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range : [61, 63], code: 'blackenvelopeg' },
      { range: [64, 69], code: 'blackpinkbox' },
      { range: [70, 75], code: 'blackesmalteira' },
      { range: [76, 80], code: 'black50reais' },
      { range: [81, 82], code: 'blackfrete' },
    ],
    '2024-11-07': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 69], code: 'blackpinkbox' },
      { range: [70, 72], code: 'blackesmalteira' },
      { range: [73, 74], code: 'black50reais' },
      { range: [75, 76], code: 'blackfrete' },
    ],
    '2024-11-08': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 69], code: 'blackpinkbox' },
      { range: [70, 75], code: 'blackesmalteira' },
      { range: [76, 78], code: 'black50reais' },
      { range: [79, 80], code: 'blackfrete' },
    ],
    '2024-11-09': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 69], code: 'blackpinkbox' },
      { range: [70, 74], code: 'blackesmalteira' },
      { range: [75, 77], code: 'black50reais' },
      { range: [78, 79], code: 'blackfrete' },
    ],
    '2024-11-10': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 71], code: 'blackpinkbox' },
      { range: [72, 80], code: 'blackesmalteira' },
      { range: [81, 85], code: 'black50reais' },
      { range: [86, 90], code: 'blackfrete' },
    ],
    '2024-11-11': [
      { range: [1, 60], code: 'blackenvelopep' },
      { range: [61, 63], code: 'blackenvelopeg' },
      { range: [64, 71], code: 'blackpinkbox' },
      { range: [72, 77], code: 'blackesmalteira' },
      { range: [78, 82], code: 'black50reais' },
      { range: [83, 84], code: 'blackfrete' },
    ],
    '2024-11-12': [
      { range: [1, 30], code: 'blackenvelopep' },
      { range: [31, 33], code: 'blackenvelopeg' },
      { range: [34, 41], code: 'blackpinkbox' },
      { range: [42, 47], code: 'blackesmalteira' },
      { range: [48, 52], code: 'black50reais' },
      { range: [53, 54], code: 'blackfrete' },
    ],
    '2024-11-13': [
      { range: [1, 30], code: 'blackenvelopep' },
      { range: [31, 33], code: 'blackenvelopeg' },
      { range: [34, 41], code: 'blackpinkbox' },
      { range: [42, 47], code: 'blackesmalteira' },
      { range: [48, 52], code: 'black50reais' },
      { range: [53, 57], code: 'blackfrete' },
    ],
    '2024-11-14': [
      { range: [1, 30], code: 'blackenvelopep' },
      { range: [31, 33], code: 'blackenvelopeg' },
      { range: [34,  41], code: 'blackpinkbox' },
      { range: [42, 47], code: 'blackesmalteira' },
      { range: [48, 52], code: 'black50reais' },
      { range: [53, 55], code: 'blackfrete' },
    ],
    '2024-11-15': [
      { range: [1, 80], code: 'blackenvelopep' },
      { range: [81, 83], code: 'blackenvelopeg' },
      { range: [84, 91], code: 'blackpinkbox' },
      { range: [92, 97], code: 'blackesmalteira' },
      { range: [98, 102], code: 'black50reais' },
      { range: [103, 104], code: 'blackfrete' },
    ],
    '2024-11-16': [
      { range: [1, 30], code: 'blackenvelopep' },
      { range: [31, 33], code: 'blackenvelopeg' },
      { range: [34, 39], code: 'blackpinkbox' },
      { range: [40, 45], code: 'blackesmalteira' },
      { range: [46, 50], code: 'black50reais' },
      { range: [51], code: 'blackfrete' },
    ],
    '2024-11-17': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 25], code: 'blackesmalteira' },
      { range: [26, 30], code: 'black50reais' },
      { range: [31, 35], code: 'blackfrete' },
    ],
    '2024-11-18': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 25], code: 'blackesmalteira' },
      { range: [26, 30], code: 'black50reais' },
      { range: [31, 35], code: 'blackfrete' },
    ],
    '2024-11-19': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 34], code: 'blackfrete' },
    ],
    '2024-11-20': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 37], code: 'blackfrete' },
    ],
    '2024-11-21': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 34], code: 'blackfrete' },
    ],
    '2024-11-22': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalte ira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 37], code: 'blackfrete' },
    ],
    '2024-11-23': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 35], code: 'blackfrete' },
    ],
    '2024-11-24': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 19], code: 'blackpinkbox' },
      { range: [20, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 37], code: 'blackfrete' },
    ],
    '2024-11-25': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 21], code: 'blackpinkbox' },
      { range: [22, 31], code: 'blackesmalteira' },
      { range: [32, 37], code: 'black50reais' },
      { range: [38, 42], code: 'blackfrete' },
    ],
    '2024-11-26': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 21], code: 'blackpinkbox' },
      { range: [22, 31], code: 'blackesmalteira' },
      { range: [32, 41], code: 'black50reais' },
      { range: [42, 46], code: 'blackfrete' },
    ],
    '2024-11-27': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 21], code: 'blackpinkbox' },
      { range: [22, 31], code: 'blackesmalteira' },
      { range: [32, 41], code: 'black50reais' },
      { range: [42, 47], code: 'blackfrete' },
    ],
    '2024-11-28': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 21], code: 'blackpinkbox' },
      { range: [22, 31], code: 'blackesmalteira' },
      { range: [32, 41], code: 'black50reais' },
      { range: [42, 46], code: 'blackfrete' },
    ],
    '2024-11-29': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 21], code: 'blackpinkbox' },
      { range: [22, 31], code: 'blackesmalteira' },
      { range: [32, 39], code: 'black50reais' },
      { range: [40, 42], code: 'blackfrete' },
    ],
    '2024-11-30': [
      { range: [1, 10], code: 'blackenvelopep' },
      { range: [11, 13], code: 'blackenvelopeg' },
      { range: [14, 17], code: 'blackpinkbox' },
      { range: [18, 27], code: 'blackesmalteira' },
      { range: [28, 32], code: 'black50reais' },
      { range: [33, 37], code: 'blackfrete' },
    ],
  };

  const currentDate = new Date().toISOString().slice(0, 10);

  const getPrizeCode = async (randomNumber: number): Promise<string> => {
    const rules = prizeRules[currentDate as keyof typeof prizeRules];
    if (!rules) return '';

    // Obter códigos ativos via API
    const activePrizes: (string | null)[] = await Promise.all(prizes.map(async (prize) => {
        const response = await fetch(`/api/rnb/pvt/coupon/${prize.code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-mfmgroup-JRARVZ',
                'X-VTEX-API-AppToken': 'TYDSNCNFUXBHOXTCDAOEDUEQUYVENMUGGSNQORXBEFMKMHIITXIPAXVUAXODZBMLCKKFHNFBDSYKFPKFOTYVMBRUGMBAJPUCWVBFARYTOQWWORTAZIXKSSKZWBZRGGNL',
            },
        });
        const data = await response.json();
        // console.log(data);
        return data.isArchived ? null : prize.code; // Retorna o código se não estiver arquivado
    }));

    // Filtrar apenas prêmios ativos e garantir que o tipo seja string[]
    const validPrizes: string[] = activePrizes.filter((prize): prize is string => prize !== null);

    for (const rule of rules) {
        if (randomNumber >= rule.range[0] && randomNumber <= rule.range[1]) {
            if (validPrizes.includes(rule.code)) {
                return rule.code; // Retorna o código do prêmio ativo
            }
        }
    }

    return '';
};

const handleSpin = async (): Promise<void> => {
  if (!spinning && !hasSpun && prizes.length > 0) {
      setSpinning(true);
      setHasSpun(true);

      let prizeCode = '';
      let randomNumber = 0;

      // Continue sorteando até encontrar um cupom válido
      while (true) {
          randomNumber = Math.floor(Math.random() * 78) + 1; // Gera um número aleatório
          prizeCode = await getPrizeCode(randomNumber); // Obtém o código do prêmio

          // Adiciona um log para ver o cupom sorteado
          // console.log(`Tentativa de cupom sorteado: ${prizeCode}`);

          // Se o cupom não estiver arquivado, sai do loop
          if (prizeCode) {
              break; // Sai do loop se um cupom válido for encontrado
          }
      }

      // Exibe o cupom sorteado no console
      // console.log(`Cupom sorteado: ${prizeCode}`);

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
        src="https://stermax.com.br/images_idealine/logo-branco.png"
        alt="Logo"
        className={styles.logoImageIdealine}
      />
      <img
        src={thirdLayout
            ? "https://stermax.com.br/images_idealine/UAAAU.svg"
            : "https://stermax.com.br/images_idealine/titulo-roleta-premios.svg"}
        alt="Título Roleta Prêmios"
        className={styles.titleImage}
      />
      <div className={styles.conteinerTextos2Layout}>
        <div className={styles.conteinerTextos2LayoutTKS}>
          <p>{thirdLayout ? "QUE PRÊMIO SUPER BACANA." : "AGRADECEMOS SEU CADASTRO!"}</p>
        </div>
        <div className={styles.conteinerTextos2LayoutChegou}>
          <p>{thirdLayout ? "PARABÉNS!" : "CHEGOU A HORA DE TESTAR A SUA SORTE"}</p>
        </div>
        <div className={styles.conteinerTextos2LayoutTorcendo}>
          <p className={thirdLayout ? styles.underline : ""}>
            {thirdLayout ? "AGORA É COM VOCÊ:" : "ESTAMOS TORCENDO POR VOCÊ!"}
          </p>
        </div>
      </div>

      {/* Exibe a nova div somente no terceiro layout */}
      {thirdLayout && (
        <div className={styles.AgoraEhComVC}>
          <ul className={styles.List}>
            <li>Informe o código do cupom sorteado via Whatsapp.</li>
            <li>Ou faça a compra diretamente aqui no site.</li>
            <li>Preencha todos os dados para a compra, e o campo do cupom aparecerá na última etapa antes do pagamento.
              Lembre-se de digitar em letras maiúsculas.
            </li>
          </ul>

          {/* Botões de Compra */}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                if (selectedPrize) {
                  window.open(
                    `https://wa.me/5541998516332?text=Olá, ganhei o cupom com o prêmio ${selectedPrize.code.toUpperCase()} na roleta, quero efetuar a compra e garantir meu prêmio`,
                    '_blank'
                  );
                }
              }}
              className={styles.whatsappButton}
            >
              COMPRAR COM CONSULTORA E GARANTIR O MEU PRÊMIO
              <img src="https://stermax.com.br/images_idealine/ícone de What.svg" alt="Ícone whatsapp" className={styles.whatsConsultoras} />
            </button>

            <button
              onClick={() => window.open('https://www.idealine.com.br', '_blank')}
              className={styles.siteButton}
            >
              COMPRAR PELO SITE E GARANTIR O MEU PRÊMIO
              <img src="https://stermax.com.br/images_idealine/sacola.svg" alt="Ícone compra no site" className={styles.iconeSacola} />
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
                        src="https://stermax.com.br/images_idealine/pointer.png"
                        alt="Ponteiro"
                        className={`${styles.pointer} ${spinning ? styles.pointerVibrate : ''}`}
                      />
                      <div className={styles.wheel} style={{ transform: `rotate(${rotation}deg)` }}>
                        <img
                          src="https://stermax.com.br/images_idealine/roleta_imagens_v2.png"
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
                            Você <strong>GANHOU o CUPOM <span onClick={() => copyToClipboard(selectedPrize.code.toUpperCase())} style={{ cursor: 'copy' }}>
                            {selectedPrize.code.toUpperCase()}
                            </span></strong> nas compras acima de R$ 390 reais.
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
