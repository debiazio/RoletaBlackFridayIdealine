
import React, { useState, useEffect } from 'react';
import styles from './roleta.css';

const Roleta = () => {
  const [prizes, setPrizes] = useState<{ code: string, title: string }[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<{ code: string, title: string } | null>(null);
  const [showSpinButton, setShowSpinButton] = useState(false); // Controla a exibição do botão



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
          !coupon.isArchived && coupon.couponCode.toLowerCase().startsWith('black') // Filtra cupons ativos que começam com "black"
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
      console.log('Success Message Detected:', !!successMessage); // Debugging line
      if (successMessage && !hasSpun) {
        setShowSpinButton(true); // Exibe o botão quando a mensagem de sucesso aparecer
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [hasSpun]);

  const handleSpin = (): void => {
    if (!spinning && !hasSpun && prizes.length > 0) {
      setSpinning(true);
      setHasSpun(true);

      const prizeIndex = Math.floor(Math.random() * prizes.length);
      const segmentAngle = 360 / prizes.length;
      const spinDegrees = 360 * 4 - (prizeIndex * segmentAngle);
      const spinTime = 3000;

      setRotation(spinDegrees);

      setTimeout(() => {
        setSpinning(false);
        setSelectedPrize(prizes[prizeIndex]); // Salva o objeto completo, com código e título
      }, spinTime);
    }
  };

  return (
    <div className={styles.roletaContainer}>
      <div className={styles.wheelContainer}>
        <img
          src="https://stermax.com.br/images_idealine/pointer.png"
          alt="Ponteiro"
          className={`${styles.pointer} ${spinning ? styles.pointerVibrate : ''}`}
        />

        <div className={styles.wheel} style={{ transform: `rotate(${rotation}deg)` }}>
          <img
            src="https://stermax.com.br/images_idealine/Roleta_dourada_Texto.png"
            alt="Roleta"
            className={styles.wheelImage}
          />
          <div className={styles.prizesOverlay}>
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={styles.prizeSegment}
                style={{ transform: `rotate(${index * (360 / prizes.length)}deg)` }}
              >
                <span className={styles.segmentText}>{prize.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exibir o botão "Girar" apenas quando permitido */}
      {showSpinButton && (
        <div className={styles.spinButtonContainer}>
          <button
            onClick={handleSpin}
            className={`${styles.spinButton} ${selectedPrize ? styles.pulsatingButton : ''}`} // Aplicar efeito pulsante
            disabled={spinning || hasSpun} // Desabilitar quando já girou
          >
            {spinning ? 'Girando...' : selectedPrize ? selectedPrize.code : 'Girar a Roleta'} {/* Exibe o código do cupom */}
          </button>
        </div>
      )}

      {/* Mensagem final com botão do WhatsApp */}
      {!spinning && selectedPrize && (
        <div className={styles.prize}>
          <p>Parabéns! Você ganhou o cupom "{selectedPrize.code}".</p> {/* Exibe o código do cupom */}



            <div className={styles.botaowhats}>
              <p className={styles.textoPrize}>
                 <a className={styles.textoPrizeLink} href={`https://api.whatsapp.com/send?phone=5541998516332&text=Olá, ganhei o cupom ${selectedPrize.code} na roleta!`}>Clique aqui para falar com uma de nossas consultoras</a>
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=5541998516332&text=Olá, ganhei o cupom ${selectedPrize?.code} na roleta!`}
                className={styles.whatsappButton}
              >
                <img
                  src="https://stermax.com.br/images_idealine/Digital_Glyph_Green.png"
                  alt="Ícone WhatsApp"
                  className={styles.whatsappIcon}
                />
              </a>

            </div>
            <div className={styles.botaosite}>
              <p className={styles.textoPrize}>
                <a className={styles.textoPrizeLink} href={`https://idealine.com.br/`}>Ou clique aqui e use o cupom sorteado no nosso site
                <img src="https://stermax.com.br/images_idealine/sacola.svg" alt="Ícone sacola" className={styles.SacolaIcon}/>
                </a>
              </p>

            </div>

        </div>
      )}
    </div>
  );
};

export default Roleta;
