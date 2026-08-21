/* KittiSU — MD3 motion: return-to-top FAB + anime.js entrance animations.
   No UI content is changed; this only adds decorative motion. */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  function animateOnce(el, opts) {
    if (!el || el.getAttribute('data-md-anim') === '1') return;
    el.setAttribute('data-md-anim', '1');
    if (typeof anime === 'undefined') {
      el.style.opacity = '1';
      return;
    }
    anime(Object.assign({ targets: el, opacity: [0, 1] }, opts));
  }

  function animateHome() {
    var hero = document.querySelector('.VPHero');
    if (hero) {
      ['name', 'text', 'tagline', 'actions'].forEach(function (cls, i) {
        var el = hero.querySelector('.' + cls);
        if (el) animateOnce(el, { translateY: [18, 0], delay: 80 * i, duration: 650, easing: 'easeOutCubic' });
      });
    }
    document.querySelectorAll('.VPFeatures .item').forEach(function (card) {
      animateOnce(card, { translateY: [22, 0], duration: 600, easing: 'easeOutCubic' });
    });
    var doc = document.querySelector('.vp-doc');
    if (doc) {
      Array.prototype.forEach.call(doc.children, function (child, i) {
        animateOnce(child, { translateY: [12, 0], delay: 60 + 30 * i, duration: 520, easing: 'easeOutCubic' });
      });
    }
  }

  var btn;
  function ensureBtn() {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'md-backtotop';
    btn.setAttribute('aria-label', 'Return to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
    return btn;
  }

  function onScroll() {
    var b = ensureBtn();
    if (window.scrollY > 420) b.classList.add('is-visible');
    else b.classList.remove('is-visible');
  }

  onReady(function () {
    ensureBtn();
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // anime.js loads via a deferred CDN script; wait briefly, then animate.
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (typeof anime !== 'undefined' || tries > 30) {
        clearInterval(iv);
        animateHome();
      }
    }, 100);
    animateHome();
    // Re-run on SPA route changes (VitePress swaps content without full reload).
    var obs = new MutationObserver(function () { animateHome(); onScroll(); });
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
