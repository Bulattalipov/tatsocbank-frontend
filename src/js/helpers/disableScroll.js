/* eslint-disable no-param-reassign */
function lockPadding() {
  const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
  const fixBlocks = document.querySelectorAll('.fix-block');
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  document.body.style.paddingRight = paddingOffset;
}

function unlockPadding() {
  const fixBlocks = document.querySelectorAll('.fix-block');
  fixBlocks.forEach((el) => {
    el.style.paddingRight = '0px';
  });
  document.body.style.paddingRight = '0px';
}

export function enableScroll() {
  const pagePosition = parseInt(document.body.dataset.position, 10);
  unlockPadding();
  document.body.style.top = 'auto';
  document.body.classList.remove('disable-scroll');
  window.scroll({ top: pagePosition, left: 0 });
  document.body.removeAttribute('data-position');
}

export function disableScroll() {
  const pagePosition = window.scrollY;
  lockPadding();
  document.body.classList.add('disable-scroll');
  document.body.dataset.position = pagePosition;
  document.body.style.top = `-${pagePosition}px`;
}
