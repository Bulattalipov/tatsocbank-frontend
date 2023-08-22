export default () => {
  const steps = document.querySelectorAll('.js-info-steps');

  if (steps.length === 0) return;

  for (let i = steps.length - 1; i >= 0; i--) {
    if (i === 0) {
      steps[2].style.setProperty('--r', '360deg');
    }
  }
};
