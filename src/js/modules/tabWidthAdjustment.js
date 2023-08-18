export default () => {
  if (window.matchMedia('(min-width: 768px)').matches) {
    const tabsList = document.querySelectorAll('.tabs-list');

    if (tabsList.length === 0) return;

    tabsList.forEach((tabsListItem, i) => {
      const tabsItems = tabsListItem.querySelectorAll('.tabs-list__item');

      if (tabsItems.length > 5) {
        tabsList[i].style.width = '100%';
        tabsList[i].style.justifyContent = 'space-between';
      }
    });
  }
};
