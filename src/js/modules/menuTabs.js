export default function menuTabs() {
  const menu = document.querySelector('.js-mobile-menu');
  if (!menu) return;

  const tabs = menu.querySelectorAll('.js-menu-tabs');
  tabs.forEach((tab) => {
    const navtButtons = tab.querySelectorAll('.js-menu-tabs-button');

    navtButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault;
        tabs.forEach((t) => {
          if (t.dataset.group === button.dataset.group) {
            t.classList.add('active');
          } else {
            t.classList.remove('active');
          }
        });
      });
    });
  });
}
