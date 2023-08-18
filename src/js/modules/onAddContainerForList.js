export default () => {
  if (document.querySelector('.edit-mode')) {
    const block = document.querySelector('.page-intro--white-bg');
    const list = Array.from(document.querySelectorAll('.section-text'));
    const fixedBlock = document.querySelector('.news-and-article__fixed-block');

    if (!block) return;
    if (!list) return;
    if (!fixedBlock) return;

    // const copyList = list.map((item) => {
    //   const blockItem = item.querySelector('.news-and-article');
    //   item.querySelector('.site-container').remove();
    //   return blockItem;
    // });

    const copyList = list.map((item) => item);

    copyList.forEach((item) => {
      item.querySelector('.site-container').classList.remove('site-container');
    });

    list.forEach((item) => {
      item.remove();
    });

    const div = document.createElement('div');
    div.classList.add('page-section');
    div.classList.add('not-js-section');
    div.classList.add('sticky-container');
    div.setAttribute('data-sticky-container', '');

    const divChild = document.createElement('div');
    divChild.classList.add('site-container');
    div.append(divChild);

    const currentDivChild = div.querySelector('.site-container');

    fixedBlock.style.visibility = 'visible';
    currentDivChild.append(...copyList, fixedBlock);

    block.after(div);
  }
};

export function twoFunction() {
  if (document.querySelector('.edit-mode')) {
    const block = document.querySelector('[data-sticky-container]');
    const list = Array.from(document.querySelectorAll('.section-text'));
    const fixedBlock = document.querySelector('.vacancy-text__fixed-block');
    const vacancyText = document.querySelector('.vacancy-text');

    if (!block) return;
    if (!list) return;
    if (!fixedBlock) return;

    vacancyText.classList.remove('vacancy-text');

    const copyList = list.map((item) => item);

    copyList.forEach((item) => {
      item.querySelector('.site-container').classList.remove('site-container');
    });

    list.forEach((item) => {
      item.remove();
    });

    fixedBlock.before(...copyList);
  }
}
