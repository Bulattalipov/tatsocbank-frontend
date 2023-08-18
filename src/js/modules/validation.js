/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import $ from 'jquery';
import 'parsleyjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

window.Parsley.addValidator('requiredIfChecked', {
  requirementType: 'string',
  validateString: (value, requirement) => {
    const checkbox = document.querySelector(requirement);

    if (!checkbox) {
      return false;
    }

    if (checkbox.checked && !value.trim()) {
      return false;
    }
    return true;
  },
  messages: {
    en: 'Required field',
    ru: 'Обязательное поле',
  },
  priority: 33,
});

window.Parsley.addValidator('fio', {
  requirementType: 'string',
  validateString: (value) => {
    if (value.trim() === '') return true;
    return /^[a-яA-Я\s]+$/.test(value);
  },
  messages: {
    en: 'Only Latin and Russian letters are allowed',
    ru: 'Допустимо использовать только латинские и русские буквы',
  },
});

window.Parsley.addValidator('numbers', {
  requirementType: 'string',
  validateString: (value) => {
    if (value.trim() === '') return true;
    return /^[\d]+$/.test(value);
  },
  messages: {
    en: 'You can only enter numbers',
    ru: 'Допустимо вводить только цифры',
  },
});

window.Parsley.addValidator('rus', {
  requirementType: 'string',
  validateString: (value) => {
    if (value.trim() === '') return true;
    return /^[А-Яа-яЁё]+$/.test(value);
  },
  messages: {
    en: '',
    ru: 'Введите адрес на русском',
  },
});

window.Parsley.addValidator('phone', {
  requirementType: 'string',
  validateString: (value) => {
    if (value.trim() === '') return true;
    return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value);
  },
  messages: {
    en: 'This value should be a mobile number',
    ru: 'Неверный номер моб. телефона',
  },
});

window.Parsley.addValidator('maxFileSize', {
  validateString(_value, maxSize, parsleyInstance) {
    if (!window.FormData) {
      return true;
    }

    const {
      files,
    } = parsleyInstance.$element[0];

    const result = files.length != 1 || files[0].size <= maxSize * 1024 * 1024;

    const parent = parsleyInstance.$element[0].closest('.callback-resume__form-file');

    const text = parent.querySelector('.callback-resume__form-file-name-text');
    const fileName = parsleyInstance.$element[0].files[0].name;
    text.textContent = fileName.length >= 22 ? `${fileName.slice(0, 22)}...` : `${fileName.slice(0, 25)}`;

    const textContainer = parent.querySelector('.callback-resume__form-file-name');
    textContainer.style.display = 'block';

    const icon = parent.querySelector('.callback-resume__form-file-icon');
    const desc = parent.querySelector('.callback-resume__form-file-text');
    icon.style.display = 'none';
    desc.style.display = 'none';

    parent.querySelector('.callback-resume__form-file-name-close').addEventListener('click', (e) => {
      e.preventDefault();
      parsleyInstance.$element[0].value = '';
      textContainer.style.display = 'none';
      icon.style.display = 'flex';
      desc.style.display = 'block';
    });

    return result;
  },
  requirementType: 'integer',
  messages: {
    en: `
    <span class="error">
      <span class="error__text-wrapper">
        <span class="error__text">The file size should not exceed %s MB</span>
      </span>
    </span>`,
    ru: `
    <span class="error">
      <span class="error__text-wrapper">
        <span class="error__text">Размер файла не должен превышать %s МБ</span>
      </span>
    </span>`,
  },
  priority: 40,
});

window.Parsley.addValidator('date', {
  requirementType: 'string',
  validateString: (value) => {
    if (value.trim() === '') return true;
    return dayjs(value, 'DD.MM.YYYY', true).isValid();
  },
  messages: {
    en: 'Enter correct date',
    ru: 'Введите правильно дату',
  },
});

Parsley.addMessages('ru', {
  defaultMessage: 'Некорректное значение.',
  type: {
    email: 'Неверный email',
    url: 'Адрес сайта введен неверно.',
    number: 'Введите число.',
    integer: 'Введите целое число.',
    digits: 'Введите только цифры.',
    alphanum: 'Введите буквенно-цифровое значение.',
  },
  notblank: 'Это поле должно быть заполнено.',
  required: 'Обязательное поле',
  pattern: 'Некорректное значение',
  min: 'Не менее чем %s символов.',
  max: 'Введите максимум %s символов',
  range: 'Это значение должно быть от %s до %s.',
  minlength: 'Не менее чем %s символов.',
  maxlength: 'Не более чем %s символов.',
  length: 'Это значение должно содержать от %s до %s символов.',
  mincheck: 'Выберите не менее %s значений.',
  maxcheck: 'Выберите не более %s значений.',
  check: 'Выберите от %s до %s значений.',
  equalto: 'Несовпадающие пароли',
});

Parsley.setLocale('ru');

export default function validation() {
  const formsToValidate = Array.from(document.querySelectorAll('form[data-need-validation]'));

  formsToValidate.forEach((form) => {
    $(form).parsley({
      focus: 'none',
      errorClass: 'is-error',
      successClass: 'success',
      classHandler: (field) => field.$element.closest('.js-validation-wrapper'),
      trigger: 'change',
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const url = form.getAttribute('action');
      const successModal = form.dataset.sucess;

      if ($(form).parsley().isValid()) {
        console.log(successModal);

        axios.post(url, formData)
          .then((response) => {
            console.log(response);

            window.tatsocbank_api.modal.close();
            window.tatsocbank_api.modal.onOpen(successModal);

            form.reset();
            if (form.querySelector('.callback-resume__form-file-name-close')) {
              form.querySelector('.callback-resume__form-file-text').style.display = 'block';
              form.querySelector('.callback-resume__form-file-icon').style.display = 'flex';
              form.querySelector('.callback-resume__form-file-name').style.display = 'none';
            }
          })
          .catch((error) => {
            console.log(error.message);
            window.tatsocbank_api.modal.close();
            window.tatsocbank_api.modal.onOpen('error');
          });
      }
    });
  });

  // document.querySelectorAll('.input__control:not(.js-range-single-input, .no_validate), .texarea__control').forEach((inpt) => {
  //   inpt.addEventListener('input', () => {
  //     const form = inpt.closest('form');
  //     if (form.hasAttribute('data-need-validation') && $(form).parsley().isValid()) {
  //       form.querySelector('.button').removeAttribute('disabled');
  //     } else {
  //       form.querySelector('.button').setAttribute('disabled', 'disabled');
  //     }
  //   });
  // });
}
