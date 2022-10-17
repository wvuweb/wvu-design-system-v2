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
  let hideAlert = 'false'; // NOTE: Can't store booleans in sessionStorage
  const alertNode = document.querySelector('#js-bootstrap-alert');
  const focusedElement = document.querySelector('#js-masthead');

  // Variable checks:
  if (!alertNode) return;
  if (!focusedElement) return;

  // Initialize alert to be used with the Bootstrap JS API:
  const alert = bootstrap.Alert.getOrCreateInstance(alertNode);

  // If someone has already clicked to hide the alert, hide it:
  const alertState = sessionStorage.getItem('hideAlertKey');
  if (alertState === 'true') {
    return alert.close();
  }

  // Add `fade show` classes to animate the component on close when the alert is showing:
  alertNode.classList.add('fade', 'show');

  // Now that we know it's showing, set session storage state and close it on click:
  alertNode.addEventListener('closed.bs.alert', () => {
    hideAlert = 'true';
    sessionStorage.setItem('hideAlertKey', hideAlert); // Store alert state
    focusedElement.setAttribute('tabindex', '-1'); // Required for non-interactive elements
    focusedElement.focus(); // NOTE: This must come before `alert.close();`
    alert.close();
  }, {
    once: true
  });
})();
