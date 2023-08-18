/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
import noUiSlider from 'nouislider';

export default () => {
  const slidersSingle = document.querySelectorAll('.js-range-single');

  if (slidersSingle.length === 0) return;

  const setRangeSlider = (i, val, slider) => {
    const arr = [null, null];
    arr[i] = val;

    slider.noUiSlider.set(arr);
  };

  function toArabic(x) {
    return x.toLocaleString('cs-CZ');
  }

  function declOfNum(number, words) {
    return words[
      (number % 100 > 4 && number % 100 < 20)
        ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]
    ];
  }

  slidersSingle.forEach((slider) => {
    const start = Number(slider.dataset.start) || 10;
    const step = Number(slider.dataset.step) || 10;
    const min = Number(slider.dataset.min) || 10;
    const max = Number(slider.dataset.max) || 10000;
    const { price, text } = slider.dataset;
    const chidInput = slider.closest('.js-range-single-parent').querySelector('.js-range-single-input');

    noUiSlider.create(slider, {
      start,
      step,
      connect: 'lower',
      format: {
        from: (formattedValue) => Number(formattedValue),
        to: (numericValue) => Math.round(numericValue),
      },
      range: {
        min,
        max,
      },
    });

    slider.noUiSlider.on('update', (values) => {
      if (price === 'priceBefore') {
        chidInput.value = 'До ' + toArabic(Math.round(values[0])) + ' ₽';
      } else if (price === 'price') {
        chidInput.value = toArabic(Math.round(values[0])) + ' ₽';
      } else if (text) {
        chidInput.value = toArabic(Math.round(values[0])) + ' ' + declOfNum(Number(Math.round(values[0])), ['год', 'года', 'лет']);
      } else {
        chidInput.value = toArabic(Math.round(values[0]));
      }
    });

    chidInput.addEventListener('change', (e) => {
      setRangeSlider(0, e.currentTarget.value, slider);
    });

    window.tatsocbank_api.ranges.push(slider);
  });
};
