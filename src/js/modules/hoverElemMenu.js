export default () => {
  const dropdownMenuRow = document.querySelectorAll('.dropdown-menu__row');

  dropdownMenuRow.forEach((dropdownItem) => {
    const linksMenu = dropdownItem.querySelectorAll('.dropdown-menu__link');
    const dropdownMoreLink = dropdownItem.querySelectorAll('.dropdown-menu__more-link');

    linksMenu.forEach((item, i) => {
      item.addEventListener('mouseover', (event) => {
        linksMenu.forEach((elem, j) => {
          if (i === j) {} else {
            elem.style.color = '#b7b7b7';
          }
        });
        if (dropdownMoreLink[1]) {
          dropdownMoreLink[1].style.color = '#b7b7b7';
        }
      });
      item.addEventListener('mouseout', (event) => {
        linksMenu.forEach((elem, j) => {
          if (i === j) {} else {
            elem.style.color = '#2a2a2a';
          }
        });
        if (dropdownMoreLink[1]) {
          dropdownMoreLink[1].style.color = '#2a2a2a';
        }
      });
    });
  });
};
