// WVU Dropdown Navigation
// ==================================================
// An accessible, keyboard friendly dropdown navigation.
// Dependencies: @meom/navigation index.esm.min.js v1.0.5 by @samikeijonen
// https://github.com/MEOM/navigation

import { Navigation } from '../vendor/@meom/index.esm.min.js';

const meomNavigation = (() => {
  const navElement = document.querySelector('.js-wvu-site-nav-items');
  const navToggle = document.querySelector('.js-wvu-site-nav-toggle');
  const navToggleText = navToggle.querySelector('.js-wvu-site-nav-toggle-text');
  const hamburger = navToggle.querySelector('.js-wvu-hamburger');
  const hamburgerLines = navToggle.querySelectorAll('.js-wvu-hamburger__line--top, .js-wvu-hamburger__line--bottom');

  // Bail if there is no nav or toggle button.
  if (!navElement || !navToggle || !navToggleText) {
    return;
  }

  const navOptions = new Navigation(navElement, navToggle, {
    action: 'hover', // NOTE: Has to be hover because of CSS changes
    subNavClass: '.wvu-site-nav__sub-menu',
    subNavAnchors: '.js-wvu-site-nav-items > .wvu-site-nav__menu-item-has-children > a',
    subSubNavAnchors: '.js-wvu-site-nav-items .wvu-site-nav__sub-menu > .wvu-site-nav__menu-item-has-children > a',
    subToggleButtonClasses: 'wvu-site-nav__sub-toggle ms-auto p-1 p-lg-0 text-muted',
    subSubToggleButtonClasses: 'wvu-site-nav__sub-sub-toggle p-1 p-lg-0 ms-lg-auto me-lg-2 text-muted',
    visuallyHiddenClass: 'visually-hidden',
    onOpenNav: () => {
      navToggleText.innerText = 'Close Menu';
      if (!hamburger) return;
      hamburger.classList.add('js-wvu-hamburger--is-open');
      // NOTE: Add the transition class to avoid line movement on page load/refresh:
      for (const line of hamburgerLines) {
        line.classList.add('js-wvu-hamburger__transition');
      }
    },
    onCloseNav: () => {
      navToggleText.innerText = 'Open Menu';
      if (!hamburger) return;
      hamburger.classList.remove('js-wvu-hamburger--is-open');
    }
  });
})();
