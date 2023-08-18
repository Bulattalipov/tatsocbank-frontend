export default () => {
  const saleBtns = Array.from(document.querySelectorAll('.js-sale-btn'));
  const buyBtns = Array.from(document.querySelectorAll('.js-buy-btn'));

  if (saleBtns.length === 0) return;

  const saleInpt = document.querySelector('.js-sale-input').querySelector('input');
  const saleBanknote = saleInpt.closest('label').querySelector('.js-banknote');
  const buyInpt = document.querySelector('.js-buy-input').querySelector('input');
  const buyBanknote = buyInpt.closest('label').querySelector('.js-banknote');
  const banknotes = [];
  const valuesSale = [];
  const valuesBays = [];
  let currentBanknoteSale = '₽';
  let currentBanknoteBuy = '$';
  let currentCurrencyBuy1 = buyBtns[0].dataset.value.split(',').join('.');
  let currentCurrencyBuy2 = buyBtns[1].dataset.value.split(',').join('.');
  let currentCurrencySale1 = saleBtns[0].dataset.value.split(',').join('.');
  let currentCurrencySale2 = saleBtns[1].dataset.value.split(',').join('.');
  let currentBanknoteCullIndex = 0;
  let currentBanknoteCullIndex2 = 1;

  console.log('currentCurrencySale1', currentCurrencySale1);
  console.log('currentCurrencySale2', currentCurrencySale2);

  buyBtns.forEach((buyBtn) => {
    valuesBays.push(buyBtn.dataset.value);
  });

  saleBtns.forEach((saleBtn) => {
    valuesSale.push(saleBtn.dataset.value);
  });

  saleBtns.forEach((saleBtn, index) => {
    banknotes.push(saleBtn.dataset.banknote);

    saleBtn.addEventListener('click', () => {
      // if (index === currentBanknoteCullIndex2) {
      //   buyBtns.forEach((btn) => btn.classList.remove('is-active'));
      //   buyBtns[currentBanknoteCullIndex].classList.add('is-active');
      //   buyBtns.forEach((btn) => btn.classList.remove('disabled'));
      //   buyBtns[index].classList.add('disabled');
      //   currentBanknoteCullIndex2 = currentBanknoteCullIndex;
      //   currentBanknoteCullIndex = index;

      //   currentBanknoteBuy = banknotes[currentBanknoteCullIndex2];
      //   buyBanknote.innerHTML = `${currentBanknoteBuy} `;
      // }

      // console.log(currentBanknoteCullIndex, 'one');
      // console.log(currentBanknoteCullIndex2, 'two');

      saleBtns.forEach((btn) => btn.classList.remove('is-active'));
      saleBtn.classList.add('is-active');
      currentBanknoteCullIndex = index;

      currentBanknoteSale = banknotes[index];
      currentCurrencySale1 = valuesSale[currentBanknoteCullIndex].split(',').join('.');
      currentCurrencySale2 = valuesSale[currentBanknoteCullIndex2].split(',').join('.');

      const number = (buyInpt.value * (currentCurrencySale2 / currentCurrencySale1)).toFixed(2);
      saleInpt.value = number;

      saleBanknote.innerHTML = `${currentBanknoteSale} `;

      buyBtns.forEach((buyBtn, j) => {
        if (index === j) {
          buyBtns.forEach((btn) => btn.classList.remove('disabled'));
          buyBtns[index].classList.add('disabled');
        }
      });
    });
  });

  buyBtns.forEach((buyBtn, index) => {
    buyBtn.addEventListener('click', () => {
      buyBtns.forEach((btn) => btn.classList.remove('is-active'));
      buyBtn.classList.add('is-active');
      currentBanknoteCullIndex2 = index;

      currentBanknoteBuy = banknotes[index];
      currentCurrencyBuy1 = valuesBays[currentBanknoteCullIndex].split(',').join('.');
      currentCurrencyBuy2 = valuesBays[currentBanknoteCullIndex2].split(',').join('.');

      // console.log(currentCurrencyBuy1, 'bnt click CurrencyBuy', currentCurrencyBuy2);
      const number = (saleInpt.value / (currentCurrencyBuy2 / currentCurrencyBuy1)).toFixed(2);
      buyInpt.value = number;

      buyBanknote.innerHTML = `${currentBanknoteBuy} `;

      saleBtns.forEach((saleBtn, i) => {
        if (index === i) {
          saleBtns.forEach((btn) => btn.classList.remove('disabled'));
        }
      });
    });
  });

  // рассчёт калькулятора при вводе в поле продажи
  saleInpt.addEventListener('keyup', (e) => {
    const {
      value,
    } = e.target;

    // eslint-disable-next-line max-len
    // console.log(valuesBays[currentBanknoteCullIndex].split(',').join('.'), 'CurrencyBuy', valuesBays[currentBanknoteCullIndex2].split(',').join('.'));
    const number = (value / (valuesBays[currentBanknoteCullIndex2].split(',').join('.') / valuesBays[currentBanknoteCullIndex].split(',').join('.'))).toFixed(2);

    buyInpt.value = number;
  });

  // задаёт поле 0, если там будет пусто при убирании фокуса
  saleInpt.addEventListener('blur', () => {
    if (!saleInpt.value) {
      saleInpt.value = 0;
    }
  });

  // рассчёт калькулятора при вводе в поле покупки
  buyInpt.addEventListener('keyup', (e) => {
    const {
      value,
    } = e.target;

    console.log(valuesSale[currentBanknoteCullIndex].split(',').join('.'), 'CurrencySale', valuesSale[currentBanknoteCullIndex2].split(',').join('.'));
    const number = (value * (valuesSale[currentBanknoteCullIndex2].split(',').join('.') / valuesSale[currentBanknoteCullIndex].split(',').join('.'))).toFixed(2);
    saleInpt.value = number;
  });

  // задаёт поле 0, если там будет пусто при убирании фокуса
  buyInpt.addEventListener('blur', () => {
    if (!buyInpt.value) {
      buyInpt.value = 0;
    }
  });

  // saleInpt.addEventListener('click', () => {
  //   saleBtns.forEach((btn) => btn.classList.remove('disabled'));
  //   buyBtns[currentBanknoteBuyIndex].classList.add('is-active');
  //   buyBtns[currentBanknoteSaleIndex].classList.add('disabled');
  // });

  // buyInpt.addEventListener('click', () => {
  //   buyBtns[currentBanknoteSaleIndex].classList.remove('disabled');
  //   saleBtns.forEach((saleBtn, j) => {
  //     if (currentBanknoteBuyIndex === j) {
  //       saleBtns[j].classList.add('disabled');
  //     }
  //   });
  // });
};
