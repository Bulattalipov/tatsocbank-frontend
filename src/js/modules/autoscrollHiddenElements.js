import gsap from 'gsap';
import {
  ScrollTrigger
} from "gsap/dist/ScrollTrigger";

export default () => {
  const block = document.querySelector('.career-form__checkboxs');

  let btns = document.querySelectorAll('.career-form__checkboxs-label');

  btns.forEach((item, i) => {
    item.addEventListener('click', (event) => {

      gsap.to(block, {
        duration: 1.7,
        ease: 'power2.out',
        scrollTo: {
          x: btns[i],
          autoKill: true,
          offsetX: 0,
        },
      })
    });
  });
}
