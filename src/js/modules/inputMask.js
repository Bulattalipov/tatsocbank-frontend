import Inputmask from 'inputmask';

export default function phoneMask() {
  const phoneInputs = Array.from(document.querySelectorAll('.js-phone-mask'));
  const onlyNums = Array.from(document.querySelectorAll('.js-only-nums'));

  phoneInputs.forEach((input) => {
    const instance = new Inputmask({ mask: '+7 (999) 999-99-99', showMaskOnHover: false });
    instance.mask(input);
  });

  const innInputs = Array.from(document.querySelectorAll('.js-inn-input'));

  innInputs.forEach((inn) => {
    const instance = new Inputmask({ mask: '9999999999', showMaskOnHover: false });
    instance.mask(inn);
  });

  const dateInputs = Array.from(document.querySelectorAll('.js-date-input'));

  dateInputs.forEach((inn) => {
    const instance = new Inputmask({ mask: '99.99.9999', showMaskOnHover: false });
    instance.mask(inn);
  });

  onlyNums.forEach((num) => {
    const instance = new Inputmask('decimal', {
      radixPoint: ' ',
      inputtype: 'text',
    });

    instance.mask(num);
  });
}
