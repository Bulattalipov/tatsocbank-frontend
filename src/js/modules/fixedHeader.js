/* eslint-disable linebreak-style */
export default () => {
  const pageHeader = document.querySelector('.header');
  const pageHeaderDetailed = document.querySelector('.landing-detail-header');
  if (!pageHeader) return;

  window.addEventListener('scroll', () => {
    const scrollDistance = window.scrollY;

    if (scrollDistance >= 1) {
      if (pageHeader.classList.contains('header--disabled')) {
        pageHeaderDetailed.classList.add('is-visible');
      }

      pageHeader.classList.add('is-fixed');
    } else {
      if (pageHeader.classList.contains('header--disabled')) {
        pageHeaderDetailed.classList.remove('is-visible');
      }

      pageHeader.classList.remove('is-fixed');
    }
  });

  if (window.scrollY >= 1) {
    pageHeader.classList.add('is-fixed');
  }
};
