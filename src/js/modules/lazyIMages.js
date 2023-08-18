/* eslint-disable import/extensions */
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import '../../assets/js/lazysizesBG.js';
import canUseWebp from '../helpers/canUseWebp';

export default () => {
  if (canUseWebp() === false) {
    const lazyBgItems = document.querySelectorAll('.lazy[data-bg-fallback]');

    lazyBgItems.forEach((item) => {
      const srcBgFallback = item.getAttribute('data-bg-fallback');

      item.setAttribute('data-bg', srcBgFallback);
    });
  }

  document.addEventListener('lazybeforeunveil', (e) => {
    const bg = e.target.getAttribute('data-bg');
    if (bg) {
      e.target.style.backgroundImage = `url(' + ${bg} + ')`;
    }
  });
};
