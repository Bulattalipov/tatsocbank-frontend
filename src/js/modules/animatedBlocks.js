export default function blocksReveal() {
  const options = {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > (entry.target.hasAttribute('data-intersection-ratio') ? Number(entry.target.getAttribute('data-intersection-ratio')) : 0.2)) {
        entry.target.classList.add('fade-out');
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);

  const blocks = Array.from(document.querySelectorAll('section'));
  const footer = null;
  if (document.querySelector('.footer')) {
    const footer = document.querySelector('.footer');
  }
  const mobilePhone = document.querySelector('.mobile-shiled__img');

  blocks.forEach((block) => {
    if (!block.querySelector('.coins-filter__wrapper') && !block.querySelector('.coins')) {
      observer.observe(block);
    }
  });

  if (footer) {
    observer.observe(footer);
  }

  if (!mobilePhone) return;

  observer.observe(mobilePhone);
}

export function elementsBlocksReveal() {
  const options = {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > (entry.target.hasAttribute('data-intersection-ratio') ? Number(entry.target.getAttribute('data-intersection-ratio')) : 0.2)) {
        entry.target.classList.add('fade-out');
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);

  const blocks = Array.from(document.querySelectorAll('.landing-section__item'));
  blocks.forEach((block) => observer.observe(block));
}
