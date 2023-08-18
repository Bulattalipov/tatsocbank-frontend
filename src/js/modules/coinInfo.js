import { disableScroll, enableScroll } from '../helpers/disableScroll';

export default () => {
  const coinsTrigger = document.querySelectorAll('.js-coin-info-trigger');
  const coinInfoClose = document.querySelectorAll('.js-coin-info-close');
  const containers = Array.from(document.querySelectorAll('.js-coin-info-container'));

  if (coinsTrigger.length === 0) return;

  coinsTrigger.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const parent = e.target.closest('.js-coin-info-parent');

      parent.querySelector('.js-coin-info-container').classList.add('is-active');
      disableScroll();
    });
  });

  coinInfoClose.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      containers[index].classList.remove('is-active');
      enableScroll();
    });
  });
};
