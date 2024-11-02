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

  // Lista de prêmios fixos
  const prizes = [
    { code: 'blackenvelopeg', title: 'Env. G' },
    { code: 'black50reais', title: 'R$50' },
    { code: 'blackpinkbox', title: 'BOX' },
    { code: 'blackesmalteira', title: 'P. Esmaltes' },
    { code: 'blackenvelopep', title: 'Env. P' },
    { code: 'blackfrete', title: 'Frete' },
  ];

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

  const getPrizeCode = (randomNumber: number): string => {
    if (randomNumber >= 1 && randomNumber <= 60) return 'blackenvelopep';
    if (randomNumber >= 61 && randomNumber <= 66) return 'blackenvelopeg';
    if (randomNumber >= 67 && randomNumber <= 72) return 'blackpinkbox';
    if (randomNumber >= 73 && randomNumber <= 75) return 'blackesmalteira';
    if (randomNumber === 76) return 'blackfrete';
    if (randomNumber >= 77 && randomNumber <= 78) return 'black50reais';
    return '';
  };

  const handleSpin = async (): Promise<void> => {
    if (!spinning && !hasSpun && prizes.length > 0) {
      setSpinning(true);
      setHasSpun(true);

      const randomNumber = Math.floor(Math.random() * 78) + 1;
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
