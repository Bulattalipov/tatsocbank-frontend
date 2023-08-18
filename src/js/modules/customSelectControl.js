export default () => {
  const selectBox = document.querySelectorAll('.select');

  if (selectBox.length < 1) {
    return;
  }

  selectBox.forEach(select => {
    select.querySelector('.select__current').addEventListener('click', (e) => {
      select.querySelector('.select__current').classList.toggle('active');

      let currentSelect = select.querySelector('.select__current');

      let counter = [];

      Array.from(select.querySelectorAll('input[type="checkbox"]')).forEach( input => {
        if(input.checked === true) {
          counter.push(input);
        }
      });

      select.querySelector('.select__input-text').dataset.count = counter.length;

      select.querySelector('.select__input-text').classList.toggle('_empty-select', (Number(select.querySelector('.select__input-text').dataset.count) < 1));

      if(select.querySelector('.select__current').classList.contains('active')) {
        window.addEventListener('click', (e) => {
          if(e.target.closest('.select') !== currentSelect.parentElement) {
            select.querySelector('.select__current').classList.remove('active');

            let counter = [];

            Array.from(select.querySelectorAll('input[type="checkbox"]')).forEach( input => {
              if(input.checked === true) {
                counter.push(input);
              }
            });

            select.querySelector('.select__input-text').dataset.count = counter.length;

            select.querySelector('.select__input-text').classList.toggle('_empty-select', (Number(select.querySelector('.select__input-text').dataset.count) < 1));
          }
        })
      }
    })
  })
}
