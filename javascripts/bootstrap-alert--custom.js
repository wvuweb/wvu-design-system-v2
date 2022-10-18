/**
  Keep alert banner closed on page refresh
  --------------------------------
  This JS targets the Alert Banner component and uses Session Storage
  to keep the alert closed after a user has hit the close button.
  https://dsws.sandbox.wvu.edu/components/essential-elements/alert-banner
*/

const hideBootstrapAlert = (() => {
  'use strict';
  /* global sessionStorage bootstrap */

  // Variables:
  const alertNode = document.querySelector('#js-bootstrap-alert');
  const focusedElement = document.querySelector('#js-masthead');

  // Variable checks:
  if (!alertNode) return;
  if (!focusedElement) return;

  // Initialize alert to be used with the Bootstrap JS API:
  const alert = bootstrap.Alert.getOrCreateInstance(alertNode);

  // If someone has already clicked to hide the alert, hide it:
  const hideAlert = sessionStorage.getItem('hideAlertKey');
  if (hideAlert === 'true') { // NOTE: Can't store booleans in sessionStorage
    return alert.close();
  }

  // Add `fade show` classes to animate the component on close when the alert is showing:
  alertNode.classList.add('fade', 'show');

  // Now that we know it's showing, set session storage state upon click/close & move focus:
  alertNode.addEventListener('closed.bs.alert', () => {
    sessionStorage.setItem('hideAlertKey', 'true'); // Set alert state
    focusedElement.setAttribute('tabindex', '-1'); // Required for non-interactive elements
    focusedElement.focus();
  }, {
    once: true
  });
})();
