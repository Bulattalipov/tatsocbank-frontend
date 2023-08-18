import gsap from 'gsap';
import {
  ScrollTrigger
} from "gsap/dist/ScrollTrigger";

export default () => {
  const fixedMenuBtn = document.querySelector('.fixed-menu__btn');

  fixedMenuBtn.addEventListener('click', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const tabs = mobileMenu.querySelectorAll('.tab-buton');
    const bodyContaners = mobileMenu.querySelector('.mobile-menu__info-body');
    const containers = mobileMenu.querySelectorAll('.mobile-menu__container');

    const bodyContanersScrollHeight = bodyContaners.clientHeight;

    let heightTop = 0;

    tabs.forEach((item, i) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        tabs.forEach(tab => {
          tab.classList.remove('is-active');
        });
        item.classList.add('is-active');

        gsap.to(bodyContaners, {
          duration: 0.7,
          ease: 'power2.out',
          scrollTo: {
            y: containers[i],
            autoKill: false,
            offsetY: 0,
          },
        })

        heightTop = 0;
      });
    });
  })


}
