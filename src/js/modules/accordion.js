import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function accordions() {
  const SPEED = 0.3;

  const openAccordion = (element) => {
    gsap.to(element, {
      height: 'auto',
      duration: SPEED,
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  };
  const closeAccordion = (element) => {
    gsap.to(element, {
      height: 0,
      duration: SPEED,
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  };

  const ListElements = document.querySelectorAll(".accordion__list");

  if(ListElements.length === 0) return;

  ListElements.forEach(ListElement => {
    const elements = Array.from(ListElement.querySelectorAll('.js-accordion'));

    elements.forEach((element, i) => {
      const btn = element.querySelector('.js-accordion-btn');
      const content = element.querySelector('.js-accordion-content');

      btn.addEventListener('click', (event) => {
        if (element.hasAttribute('data-close-other')) {
          elements.forEach((otherElement) => {
            if (otherElement !== element) {
              if (otherElement.classList.contains('active')) {
                const accContent = otherElement.querySelector('.js-accordion-content');
                closeAccordion(accContent);
                otherElement.classList.remove('active');
              }
            }
          });
        }

        if (element.classList.contains('active')) {
          closeAccordion(content);
        } else {
          openAccordion(content);
        }
        element.classList.toggle('active');
      });
    });
  })
}
