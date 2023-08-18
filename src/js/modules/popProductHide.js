export default () => {
  const blocks = document.querySelectorAll('.popular-products');
  if(blocks.length === 0) return;

  blocks.forEach(block => {
    let tags = block.querySelectorAll('.pop-product__label');

    tags.forEach(tag => {

      if(!tag.querySelector('.pop-product__label-num').textContent) {
        tag.style.display = "none";
      }
    })
  })
}
