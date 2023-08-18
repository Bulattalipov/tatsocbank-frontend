export default () => {
  const btns = document.querySelectorAll('.page-tab-btn');

  if (btns.length === 0) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const attr = btn.dataset.tabName;
      const parent = btn.closest('.page-tab-parent');
      const contents = Array.from(parent.querySelectorAll('.page-tab-content'));

      parent.querySelectorAll('.page-tab-btn').forEach((button) => {
        button.classList.remove('is-active');
        button?.closest('.tabs-list__item').classList.remove('is-active');
      });

      btn.classList.add('is-active');
      btn?.closest('.tabs-list__item').classList.add('is-active');

      contents.forEach((content) => {
        content.classList.remove('is-active');

        if (content.dataset.tabContent === attr) {
          content.classList.add('is-active');
        }
      });
    });
  });
};
