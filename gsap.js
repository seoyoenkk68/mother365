document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector(".main-hero");
  const swiperEl = hero?.querySelector(".hero-swiper");
  const bgText = hero?.querySelector(".hero-bg-txt");
  const indicator = hero?.querySelector(".scroll-down-indicator");

  if (!hero || !swiperEl) return;

  let heroEntered = false;
  let heroTimeline = null;
  let bgTextAnimated = false;
  let indicatorAnimated = false;

  // ========================================
  // 1. 슬라이드 요소 선택
  // 배경 텍스트는 선택하지 않음
  // ========================================

  function getSlideElements(slide) {
    if (!slide) return [];

    return [
      slide.querySelector(".hero-txt h2"),
      slide.querySelector(".hero-txt p"),
      ...slide.querySelectorAll(".obj-wrap .obj:not(.obj-txt)"),
      slide.querySelector(".hero-txt a"),
    ].filter(Boolean);
  }

  // ========================================
  // 2. 슬라이드 초기화
  // ========================================

  function resetSlide(slide) {
    const elements = getSlideElements(slide);
    if (!elements.length) return;

    gsap.killTweensOf(elements);

    gsap.set(elements, {
      opacity: 0,
      y: 40,
    });
  }

  // ========================================
  // 3. 활성 슬라이드 애니메이션
  // ========================================

  function animateActiveSlide() {
    const activeSlide = swiperEl.querySelector(".swiper-slide-active");
    if (!activeSlide) return;

    if (heroTimeline) {
      heroTimeline.kill();
      heroTimeline = null;
    }

    const title = activeSlide.querySelector(".hero-txt h2");
    const desc = activeSlide.querySelector(".hero-txt p");
    const button = activeSlide.querySelector(".hero-txt a");
    const objects = activeSlide.querySelectorAll(
      ".obj-wrap .obj:not(.obj-txt)",
    );

    const elements = [title, desc, ...objects, button].filter(Boolean);

    gsap.killTweensOf(elements);

    gsap.set(elements, {
      opacity: 0,
      y: 40,
    });

    heroTimeline = gsap.timeline();

    heroTimeline
      .to(title, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(
        desc,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .to(
        objects,
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power2.out",
        },
        "<",
      )
      .to(
        button,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        "-=0.4",
      );
  }

  // ========================================
  // 4. 고정 배경 텍스트
  // 최초 진입 시 딱 한 번 실행
  // ========================================

  if (bgText) {
    gsap.set(bgText, {
      opacity: 0,
      y: 50,
    });
  }

  function showFixedElements() {
    if (bgText && !bgTextAnimated) {
      bgTextAnimated = true;

      gsap.to(bgText, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.out",
      });
    }

    if (indicator && !indicatorAnimated) {
      indicatorAnimated = true;

      gsap.fromTo(
        indicator,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power1.out",
        },
      );
    }
  }

  // ========================================
  // 5. Swiper 초기화
  // ========================================

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 1200,
    loop: true,

    autoplay: {
      delay: 6900,
      disableOnInteraction: false,
    },

    pagination: {
      el: hero.querySelector(".h-swiper-pagination"),
      clickable: true,
    },

    navigation: {
      nextEl: hero.querySelector(".h-swiper-button-next"),
      prevEl: hero.querySelector(".h-swiper-button-prev"),
    },

    on: {
      init: function () {
        // 모든 슬라이드의 등장 요소 초기화
        this.slides.forEach(function (slide) {
          resetSlide(slide);
        });
      },

      slideChangeTransitionStart: function () {
        // 새 슬라이드의 등장 애니메이션만 정리
        if (heroTimeline) {
          heroTimeline.kill();
          heroTimeline = null;
        }

        const activeSlide = swiperEl.querySelector(".swiper-slide-active");

        resetSlide(activeSlide);
      },

      slideChangeTransitionEnd: function () {
        if (heroEntered) {
          animateActiveSlide();
        }
      },
    },
  });

  // ========================================
  // 6. 스크롤 진입
  // ========================================

  ScrollTrigger.create({
    trigger: hero,
    start: "top 80%",

    onEnter: function () {
      if (!heroEntered) {
        heroEntered = true;
        showFixedElements();
        animateActiveSlide();
      }
    },

    onEnterBack: function () {
      heroEntered = true;
      showFixedElements();
      animateActiveSlide();
    },
  });
});

/*****main wide bn swiper*****/
var swiper = new Swiper(".wide-bn-swiper", {
  navigation: {
    nextEl: ".w-swiper-button-next",
    prevEl: ".w-swiper-button-prev",
  },
});
