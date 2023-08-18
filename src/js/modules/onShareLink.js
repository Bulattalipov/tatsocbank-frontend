export default () => {
  const btn = document.querySelector('.vacancy-intro__modile-btn--share');

  if (!btn) return;

  const thisUrl = window.location.href;
  const thisTitle = document.title;
  const shareObj = {
    title: thisTitle,
    url: thisUrl,
  };

  btn.addEventListener('click', async () => {
    try {
      await navigator.share(shareObj);
      console.log('MDN shared successfully');
    } catch (err) {
      console.log(err);
    }
  });
};
