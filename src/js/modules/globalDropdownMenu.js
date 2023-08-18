export default () => {
  const menuContainer = document.querySelector('.js-nav-menu-container');
  const menuItemsParents = Array.from(document.querySelectorAll('.js-dropdown-menu-parent'));
  const menuItems = Array.from(document.querySelectorAll('.js-dropdown-menu'));
  const closeBtns = Array.from(document.querySelectorAll('.js-close-dropdown-menu'));
  const header = document.querySelector('.header');

  if (!menuContainer) return;

  menuItemsParents.forEach((menu, i) => {
    menu.addEventListener('click', (event) => {
      if (event.target.classList.contains('is-active')) {
        const attrChild = menu.dataset.menuParent;

        header.classList.remove('is-menu-open');

        if (menuItems[i].dataset.menuChild === attrChild) {
          menuContainer.classList.remove('is-active');

          menuItemsParents.forEach((mn) => mn.querySelector('.nav__link').classList.remove('is-active'));
          menuItems.forEach((item) => item.classList.remove('is-active'));
        }
      } else {
        const attrChild = menu.dataset.menuParent;

        header.classList.add('is-menu-open');

        if (menuItems[i].dataset.menuChild === attrChild) {
          menuContainer.classList.add('is-active');

          menuItemsParents.forEach((mn) => mn.querySelector('.nav__link').classList.remove('is-active'));
          menuItemsParents[i].querySelector('.nav__link').classList.add('is-active');
          menuItems.forEach((item) => item.classList.remove('is-active'));
          menuItems[i].classList.add('is-active');
        }
      }
    });
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', () => {
    menuContainer.classList.remove('is-active');
    header.classList.remove('is-menu-open');
    menuItemsParents.forEach((mn) => mn.querySelector('.nav__link').classList.remove('is-active'));
  }));

  menuContainer.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.target.closest('.dropdown-menu')) return;

    menuContainer.classList.remove('is-active');
    header.classList.remove('is-menu-open');
    menuItemsParents.forEach((mn) => mn.querySelector('.nav__link').classList.remove('is-active'));
  });
};
