export default () => {
  if (window.matchMedia('(max-width: 769px)').matches) {
    const block = document.querySelector('.page-intro__btns');

    if (!block) return;

    const hideBtn = block.querySelector('[data-hide]');

    const btns = block.querySelectorAll('.button');

    if (hideBtn) {
      btns.forEach((item) => {
        item.style.width = '100%';
      });
    }
  }
};
