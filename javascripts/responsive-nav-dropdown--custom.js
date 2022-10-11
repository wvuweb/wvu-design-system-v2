const rwdNavDropdownCustom = (() => {
  'use strict';

  /* global responsiveNav */

  const customToggle = document.querySelector('.nav-toggle');
  if (!customToggle) return;

  const customToggleText = customToggle.querySelector('#js-nav-text');
  if (!customToggleText) return;

  // Init responsive nav
  const navigation = responsiveNav('.nav-collapse', {
    animate: true,                // Boolean: Use CSS3 transitions, true or false
    closeDropdown: '<span class="visually-hidden">Close sub menu</span>',  // String: Label for closing sub menu
    customToggle: customToggle.id,  // Selector: Specify the ID of a custom toggle
    enableDropdown: true,         // Boolean: Do we use multi level dropdown
    enableFocus: true,            // Boolean: Do we add 'focus' class in nav elements
    insert: 'before',             // String: Insert the toggle before or after the navigation
    menuItems: 'menu-items',      // String: Class that is added only to top ul element
    openDropdown: '<span class="visually-hidden">Open sub menu</span>',    // String: Label for opening sub menu
    openPos: 'relative',          // String: Class that is added to sub menu ul elements
    subMenu: 'sub-menu',
    transition: 600,              // Integer: Speed of the transition, in milliseconds
    close () {
      customToggleText.innerText = 'Open Menu';
    },
    open () {
      customToggleText.innerText = 'Close Menu';
    },
    resizeDesktop () {
      customToggle.removeAttribute('aria-controls');
    },
    resizeMobile () {
      customToggle.setAttribute('aria-controls', 'wvu-nav');
    }
  });
})();
