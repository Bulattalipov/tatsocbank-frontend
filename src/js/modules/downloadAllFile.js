export default () => {
  let wrapper = document.querySelectorAll('.additional-information__item-file-wrapper, .accordion__body-content-box');

  if(!wrapper.length === 0) return;

  wrapper.forEach(item => {

    if(item.classList.contains('accordion__body-content-box')) {
      let btnDownload = item.querySelector('.button__text');

      let files = item.querySelectorAll('.file .page-link-full');

      console.log(files);

      btnDownload.addEventListener('click', (e) => {
        e.preventDefault();
        files.forEach(file => {
          file.setAttribute("target", "");
          file.setAttribute("download","");
          file.click();
          file.setAttribute("target", "_blank");
        })
      })
    } else {
      let btnDownload = item.closest('.page-section').querySelector('.button__text');

      let files = item.querySelectorAll('.file .page-link-full');

      btnDownload.addEventListener('click', (e) => {
        e.preventDefault();
        files.forEach(file => {
          file.setAttribute("target", "");
          file.setAttribute("download","");
          file.click();
          file.setAttribute("target", "_blank");
        })
      })
    }
  })
}
