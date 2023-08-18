export default () => {
  const buttonForClick = document.querySelector('.vacancy-intro__socials-item--chain');

  if (!buttonForClick) return;

  buttonForClick.addEventListener('click', () => {
    if (window.isSecureContext && navigator.clipboard) {
      const link = window.location.href;
      navigator.clipboard.writeText(link);
      showResult();
    } else {
      const link = window.location.href;
      unsecuredCopyToClipboard(link);
    }
  });

  function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.style.position = "absolute";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus({preventScroll: true});
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);

    showResult();
  }

  function showResult(){
    const text = buttonForClick.querySelector('.vacancy-intro__socials-item-text');
    text.classList.add('is-active');

    const timer = setTimeout(() => {
      text.classList.remove('is-active');
      clearTimeout(timer);
    }, 4000);
  }

};
