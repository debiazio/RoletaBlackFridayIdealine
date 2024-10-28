import React, { useState, useEffect } from 'react';
import styles from './roleta.css';

const Roleta = () => {
  const [prizes, setPrizes] = useState<{ code: string, title: string }[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<{ code: string, title: string } | null>(null);
  const [showSpinButton, setShowSpinButton] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [thirdLayout, setThirdLayout] = useState(false);

  const prizeMap: { [key: string]: string } = {
    'blackesmalteira': 'Porta Esmaltes by MAD.U',
    'blackfrete': 'Frete Grátis',
    'blackenvelopeg': 'Envelope 9x25',
    'blackenvelopep': 'Envelope 5x13',
    'blackpinkbox': 'BOX MAD.U',
    'black50reais': 'R$50 OFF'
  };

  const fetchPrizes = async (): Promise<void> => {
    try {
      const response = await fetch('/api/rnb/pvt/coupon', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': 'vtexappkey-mfmgroup-JRARVZ',
          'X-VTEX-API-AppToken': 'TYDSNCNFUXBHOXTCDAOEDUEQUYVENMUGGSNQORXBEFMKMHIITXIPAXVUAXODZBMLCKKFHNFBDSYKFPKFOTYVMBRUGMBAJPUCWVBFARYTOQWWORTAZIXKSSKZWBZRGGNL',
        },
      });

      const data = await response.json();

      const activePrizes = data
        .filter((coupon: any) =>
          !coupon.isArchived && coupon.couponCode.toLowerCase().startsWith('black')
        )
        .sort((a: any, b: any) => new Date(b.lastModifiedUtc).getTime() - new Date(a.lastModifiedUtc).getTime())
        .slice(0, 6)
        .map((coupon: any) => ({
          code: coupon.couponCode,
          title: prizeMap[coupon.couponCode.toLowerCase()] || coupon.couponCode
        }));

      setPrizes(activePrizes);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const successMessage = document.querySelector('.vtex-rich-text-0-x-paragraph--confirm-form-roleta');
      if (successMessage && !hasSpun) {
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

      const prizeResponse = await fetch(`/api/rnb/pvt/coupon/${prizeCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': 'vtexappkey-mfmgroup-JRARVZ',
          'X-VTEX-API-AppToken': 'TYDSNCNFUXBHOXTCDAOEDUEQUYVENMUGGSNQORXBEFMKMHIITXIPAXVUAXODZBMLCKKFHNFBDSYKFPKFOTYVMBRUGMBAJPUCWVBFARYTOQWWORTAZIXKSSKZWBZRGGNL',
        },
      });

      const prizeData = await prizeResponse.json();

      if (!prizeData.isArchived) {
        const segmentAngle = 360 / prizes.length;
        const spinDegrees = 360 * 4 - (prizes.findIndex(p => p.code === prizeCode) * segmentAngle);
        const spinTime = 3000;

        setRotation(spinDegrees);
        setSelectedPrize({ code: prizeCode, title: prizeMap[prizeCode] || prizeCode });

        setTimeout(() => {
          setSpinning(false);
          setThirdLayout(true); // Alteração para exibir o terceiro layout
        }, spinTime);
      } else {
        setSpinning(false);
        setHasSpun(false);
      }
    }
  };

  return (
    <div className={styles.roletaContainer}>
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
                <td>ENVELOPE 9x23 CM</td>
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
                <p>{thirdLayout ? "AGORA É COM VOCÊ:" : "ESTAMOS TORCENDO POR VOCÊ!"}</p>
              </div>
            </div>

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
              src="https://stermax.com.br/images_idealine/roleta_imagens.png"
              alt="Imagem da roleta"
              className={styles.wheelImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roleta;
