export default () => {
  const menu = document.querySelectorAll('.js-menu-dropdown');

  if (menu.length === 0) return;

  menu.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.menu-dropdown__container');

      parent.querySelector('.js-menu-dropdown-menu').classList.toggle('is-active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.js-menu-dropdown-menu') && !e.target.closest('.menu-dropdown__container')) {
      document.querySelectorAll('.js-menu-dropdown-menu').forEach((mn) => {
        mn.classList.remove('is-active');
      });
    }
  });
};
