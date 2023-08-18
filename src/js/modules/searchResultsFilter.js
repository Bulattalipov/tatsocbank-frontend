/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { GraphPageFilter } from './searchFilter';

export default () => {
  const inpts = document.querySelectorAll('.js-search');
  const clearbtns = document.querySelectorAll('.search__form-icon--close');
  if (inpts.length === 0) return;

  inpts.forEach((inpt) => {
    const filter = new GraphPageFilter(inpt, {
      highlightClass: 'highlight',
      childClass: 'highlight-element',
      hiddenClass: 'highlight-hidden',
      onInput: (filtered) => {

      },
    });

    if (inpt.value !== '') {
      inpt.classList.add('is-filled');
    }

    inpt.addEventListener('input', (e) => {
      const { value } = e.target;

      if (value !== '') {
        inpt.classList.add('is-filled');
      } else {
        inpt.classList.remove('is-filled');
      }
    });
  });

  clearbtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      inpts.forEach((input) => {
        input.value = '';
        input.classList.remove('is-filled');
      });
    });
  });
};
