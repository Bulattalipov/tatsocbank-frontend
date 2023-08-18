export default () => {
  const btns = document.querySelectorAll('.count-tab-btn');

  if (btns.length === 0) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const attr = btn.dataset.tabName;
      const parent = btn.closest('.page-tab-parent');
      const contents = Array.from(parent.querySelectorAll('.page-tab-content'));

      parent.querySelectorAll('.count-tab-btn').forEach((button) => {
        button.classList.remove('is-active');
      });

      btn.classList.add('is-active');

      contents.forEach((content) => {
        content.classList.remove('is-active');

        if (content.dataset.tabContent === attr) {
          content.classList.add('is-active');
        }
      });
    });
  });
};
