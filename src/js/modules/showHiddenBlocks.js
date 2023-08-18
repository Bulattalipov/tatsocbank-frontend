export default () => {
  if (window.matchMedia('(max-width: 769px)').matches) {
    const equipment = document.querySelector('.equipment');

    if (!equipment) return;

    const items = equipment.querySelectorAll('.equipment__item');
    const btn = equipment.querySelector('.equipment__btn-show');

    btn.addEventListener('click', () => {
      items.forEach((item) => {
        item.classList.add('is-active');
      });
    });
  }
};
