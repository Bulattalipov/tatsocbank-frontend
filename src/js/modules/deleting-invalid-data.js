export default function () {
  const inputs = document.querySelectorAll('[data-parsley-numbers]');

  if (!inputs.length) return;

  inputs.forEach((input) => {
    input.addEventListener('input', function () {
      const reg = /[^\d]/g;
      if (this.value.search(reg) != -1) {
        this.value = this.value.replace(reg, '');
      }
    });
  });
}
