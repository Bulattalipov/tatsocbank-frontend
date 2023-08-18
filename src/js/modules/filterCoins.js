export default () => {
  const btnFilter = document.querySelector('.coins-filter__btn');
  const btnClose = document.querySelectorAll('.js-close-filter');
  const menu = document.querySelector('.coins-mobile-filter');

  if (!btnFilter) return;

  btnFilter.addEventListener('click', () => {
    menu.classList.add('is-active');
  });

  btnClose.forEach((btn) => {
    btn.addEventListener('click', () => {
      menu.classList.remove('is-active');
    });
  });
};
