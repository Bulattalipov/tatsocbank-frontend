/* eslint-disable no-unused-vars */
import Choices from 'choices.js';

export default function initSelects() {
  const customSelects = Array.from(document.querySelectorAll('.js-select'));

  if (customSelects.length === 0) return;

  customSelects.forEach((select) => {
    const slct = new Choices(select, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
      allowHTML: true,
      searchFields: ['label', 'value', 'customProperties.description'],
    });
  });
}
