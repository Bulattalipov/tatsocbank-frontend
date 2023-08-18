// import { disableScroll, enableScroll } from '../helpers/disableScroll';

export default () => {
  const searchBtn = document.querySelector('.js-search-open');
  const searchContainer = document.querySelector('.js-search-container');
  const header = document.querySelector('.header');
  const closeBtn = document.querySelector('.js-search-close');

  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    searchContainer.classList.add('is-open');
    header.classList.add('header--bottom-disabled');

    // disableScroll();

    const header2 = document.querySelector('.header');

    console.log(header2.classList.contains('header--bottom-disabled'));

    closeBtn.addEventListener('click', () => {
      searchContainer.classList.remove('is-open');
      if (header2.classList.contains('header--bottom-disabled')) {
        header2.classList.remove('header--bottom-disabled');
      }
      // enableScroll();
    });
  });
};
