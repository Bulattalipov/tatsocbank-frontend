export default () => {
  if (window.matchMedia('(min-width: 1200px)').matches) {
    const container = document.querySelector('.js-search-fields');

    if(!container) return;

    const btn = container.querySelector('.press-center-block__search-btn');
    const inputContainer = container.querySelector('.input');
    const input = container.querySelector('.input__control');

    console.log(input);

    btn.addEventListener('click', () => {
      container.classList.toggle('is-active');
      input.focus();
    })
  }
}
