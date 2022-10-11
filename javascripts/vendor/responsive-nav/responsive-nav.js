/*! responsive-nav.js 1.1.1
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2022 @viljamis
 * Available under the MIT license
 */

/* global Event */
(function(document, window, index) {
  // Index is used to keep multiple navs on the same page namespaced

  "use strict";

  var responsiveNav = function(el, options) {

    var computed = !!window.getComputedStyle;
    
    /**
     * getComputedStyle polyfill for old browsers
     */
    if (!computed) {
      window.getComputedStyle = function(el) {
        this.el = el;
        this.getPropertyValue = function(prop) {
          var re = /(\-([a-z]){1})/g;
          if (prop === "float") {
            prop = "styleFloat";
          }
          if (re.test(prop)) {
            prop = prop.replace(re, function () {
              return arguments[2].toUpperCase();
            });
          }
          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
      };
    }
    /* exported checkPassiveEventSupport, addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach, hasClass, toggleFocus */
    
    
    /**
     * Check support for passive event listeners
     *
     * @return {bool} Returns whether {passive: true} can be used
     */
    
    var checkPassiveEventSupport = function () {
        var supported = false;
    
      try {
        var opts = {
          get passive() {
            supported = true;
          }
        };
    
        if ("addEventListener" in window) {
          window.addEventListener("test", null, opts);
          window.removeEventListener("test", null, opts);
        }
      } catch (e) {
        supported = false;
      }
      return supported;
    };
    
    /**
     * Add Event
     * fn arg can be an object or a function, thanks to handleEvent
     * read more at: http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     */
    var addEvent = function (el, evt, fn, bubble) {
      // set passive events if this is supported
      var options = checkPassiveEventSupport ? {passive: true, capture: bubble} : bubble;
    
      if ("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
          el.addEventListener(evt, fn, options);
        } catch (e) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.addEventListener(evt, function (e) {
              // Bind fn as this and set first arg as event object
              fn.handleEvent.call(fn, e);
            }, options);
          } else {
            throw e;
          }
        }
      } else if ("attachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if (typeof fn === "object" && fn.handleEvent) {
          el.attachEvent("on" + evt, function () {
            // Bind fn as this
            fn.handleEvent.call(fn);
          });
        } else {
          el.attachEvent("on" + evt, fn);
        }
      }
    };
    
    
    /**
     * Remove Event
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     */
    var removeEvent = function (el, evt, fn, bubble) {
      if ("removeEventListener" in el) {
        try {
          el.removeEventListener(evt, fn, bubble);
        } catch (e) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.removeEventListener(evt, function (e) {
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("detachEvent" in el) {
        if (typeof fn === "object" && fn.handleEvent) {
          el.detachEvent("on" + evt, function () {
            fn.handleEvent.call(fn);
          });
        } else {
          el.detachEvent("on" + evt, fn);
        }
      }
    };
    
    /**
     * Get the children of any element
     *
     * @param  {element}
     * @return {array} Returns matching elements in an array
     */
    var getChildren = function (e) {
      if (e.children.length < 1) {
        throw new Error("The Nav container has no containing elements");
      }
      // Store all children in array
      var children = [];
      // Loop through children and store in array if child != TextNode
      for (var i = 0; i < e.children.length; i++) {
        if (e.children[i].nodeType === 1) {
          children.push(e.children[i]);
        }
      }
      return children;
    };
    
    /**
     * Sets multiple attributes at once
     *
     * @param {element} element
     * @param {attrs}   attrs
     */
    var setAttributes = function (el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    };
    
    /**
     * Adds a class to any element
     *
     * @param {element} element
     * @param {string}  class
     */
    var addClass = function (el, cls) {
      el.classList.add(cls);
    };
    
    /**
     * Remove a class from any element
     *
     * @param  {element} element
     * @param  {string}  class
     */
    var removeClass = function (el, cls) {
      el.classList.remove(cls);
    };
    
    /**
     * forEach method that passes back the stuff we need
     *
     * @param  {array}    array
     * @param  {Function} callback
     * @param  {scope}    scope
     */
    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };
    
    /**
     * Checks if an element has certain class
     *
     * @param  {element}  element
     * @param  {string}   class name
     * @return {Boolean}
     */
    var hasClass = function (el, cls) {
      return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
    };
    
    /**
     * Sets or removes .focus class on an element.
     */
    var toggleFocus = function () {
      var self = this;
      var menuItems = opts.menuItems;
    
      // Move up through the ancestors of the current link until we hit 'menu-items' class.
      // That's top level ul-element class name.
      while ( -1 === self.className.indexOf( menuItems ) ) {
    
        // On li elements toggle the class .focus.
        if ( "li" === self.tagName.toLowerCase() ) {
          if ( -1 !== self.className.indexOf("focus") ) {
            self.classList.remove("focus");
          } else {
            self.classList.add("focus");
          }
        }
        self = self.parentElement;
      }
    };

    var nav;
    var opts;
    var navToggle;
    var styleElement = document.createElement("style");
    var htmlEl = document.documentElement;
    var hasAnimFinished;
    var isMobile;
    var navOpen;
    var dropdownButton;

    var ResponsiveNav = function(el, options) {
      var i;

      /**
       * Default options
       * @type {Object}
       */
      this.options = {
        animate: true,                                  // Boolean: Use CSS3 transitions, true or false
        transition: 284,                                // Integer: Speed of the transition, in milliseconds
        label: "Menu",                                  // String: Label for the navigation toggle
        insert: "before",                               // String: Insert the toggle before or after the navigation
        hamburger: false,                               // Boolean: Use Hamburger style toggle
        hamburgerClass: "",                             // String: set hamburger style
        hamburgerLabel: "",                             // String set the text label for menu
        navToggleClass: "active",                       // String: Class that is added to the navToggle
        customToggle: "",                               // Selector: Specify the ID of a custom toggle
        closeOnNavClick: false,                         // Boolean: Close the navigation when one of the links are clicked
        openPos: "relative",                            // String: Position of the opened nav, relative or static
        navClass: "nav-collapse",                       // String: Default CSS class. If changed, you need to edit the CSS too!
        navActiveClass: "js-nav-active",                // String: Class that is added to <html> element when nav is active
        jsClass: "js",                                  // String: 'JS enabled' class which is added to <html> element
        enableFocus: false,                             // Boolean: Do we add 'focus' class in nav elements
        enableDropdown: false,                          // Boolean: Do we use multi level dropdown
        menuItems: "menu-items",                        // String: Class that is added only to top ul element
        subMenu: "sub-menu",                            // String: Class that is added to sub menu ul elements
        openDropdown: "Open sub menu",                  // String: Label for opening sub menu
        closeDropdown: "Close sub menu",                // String: Label for closing sub menu
        init: function() {},                            // Function: Init callback
        open: function() {},                            // Function: Open callback
        close: function() {},                           // Function: Close callback
        resizeMobile: function() {},                    // Function: Resize callback for "mobile"
        resizeDesktop: function() {}                    // Function: Resize callback for "desktop"
      };

      // User defined options
      for (i in options) {
        this.options[i] = options[i];
      }

      // Adds "js" class for <html>
      addClass(htmlEl, this.options.jsClass);

      // Wrapper
      this.wrapperEl = el.replace("#", "");

      // Try selecting ID first
      if (document.getElementById(this.wrapperEl)) {
        this.wrapper = document.getElementById(this.wrapperEl);

        // If element with an ID doesn't exist, use querySelector
      } else if (document.querySelector(this.wrapperEl)) {
        this.wrapper = document.querySelector(this.wrapperEl);

        // If element doesn't exists, stop here.
      } else {
        throw new Error("The nav element you are trying to select doesn't exist");
      }

      // Inner wrapper
      this.wrapper.inner = getChildren(this.wrapper);

      // For minification
      opts = this.options;
      nav = this.wrapper;

      // Init
      this._init(this);
    };

    ResponsiveNav.prototype = {

      /**
       * Unattaches events and removes any classes that were added
       */
      destroy: function() {
        this._removeStyles();
        removeClass(nav, "closed");
        removeClass(nav, "opened");
        removeClass(nav, opts.navClass);
        removeClass(htmlEl, opts.navActiveClass);
        nav.removeAttribute("style");
        nav.removeAttribute("aria-hidden");

        removeEvent(window, "resize", this, false);
        removeEvent(window, "focus", this, false);
        removeEvent(document.body, "touchmove", this, false);
        removeEvent(navToggle, "touchstart", this, false);
        removeEvent(navToggle, "touchend", this, false);
        removeEvent(navToggle, "mouseup", this, false);
        removeEvent(navToggle, "keyup", this, false);
        removeEvent(navToggle, "click", this, false);

        if (!opts.customToggle) {
          navToggle.parentNode.removeChild(navToggle);
        } else {
          navToggle.removeAttribute("aria-hidden");
        }

        if (opts.enableDropdown) {
          var self = this;
          forEach(dropdownButton, function(i, el) {
            removeEvent(el, "touchstart", self, false);
            removeEvent(el, "touchend", self, false);
            removeEvent(el, "mouseup", self, false);
            removeEvent(el, "keyup", self, false);
            removeEvent(el, "click", self, false);
          });
        }

      },

      /**
       * Toggles the navigation open/close
       */
      toggle: function() {
        if (hasAnimFinished === true) {
          if (!navOpen) {
            this.open();
          } else {
            this.close();
          }
        }
      },

      /**
       * Opens the navigation
       */
      open: function() {
        if (!navOpen) {
          removeClass(nav, "closed");
          addClass(nav, "opened");
          addClass(htmlEl, opts.navActiveClass);
          addClass(navToggle, opts.navToggleClass);
          nav.style.position = opts.openPos;
          setAttributes(nav, {
            "aria-hidden": "false"
          });
          setAttributes(nav, {
            "aria-expanded": "true"
          });
          setAttributes(navToggle, {
            "aria-expanded": "true"
          });
          navOpen = true;
          opts.open();
        }
      },

      /**
       * Closes the navigation
       */
      close: function() {
        if (navOpen) {
          addClass(nav, "closed");
          removeClass(nav, "opened");
          removeClass(htmlEl, opts.navActiveClass);
          removeClass(navToggle, opts.navToggleClass);
          setAttributes(nav, {
            "aria-hidden": "true"
          });
          setAttributes(nav, {
            "aria-expanded": "false"
          });
          setAttributes(navToggle, {
            "aria-expanded": "false"
          });

          // If animations are enabled, wait until they finish
          if (opts.animate) {
            hasAnimFinished = false;
            setTimeout(function() {
              nav.style.position = "absolute";
              hasAnimFinished = true;

              if (opts.enableDropdown) {
                removeClass(nav, "dropdown-active");
                forEach(dropdownButton, function(i, el) {
                  removeClass(el, "toggled");
                  removeClass(el.nextSibling, "toggled"); // Remove class from sub-menu ul element.
                });
              }

            }, opts.transition + 10);

            // Animations aren't enabled, we can do these immediately
          } else {
            nav.style.position = "absolute";

            if (opts.enableDropdown) {
              removeClass(nav, "dropdown-active");
              forEach(dropdownButton, function(i, el) {
                removeClass(el, "toggled");
                removeClass(el.nextSibling, "toggled"); // Remove class from sub-menu ul element.
              });
            }
          }

          navOpen = false;
          opts.close();
        }
      },

      /**
       * Resize is called on window resize and orientation change.
       * It initializes the CSS styles and height calculations.
       */
      resize: function() {

        // Resize watches navigation toggle's display state
        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

          isMobile = true;
          setAttributes(navToggle, {
            "aria-hidden": "false"
          });
          setAttributes(nav, {
            "aria-expanded": "false"
          });
          setAttributes(navToggle, {
            "aria-expanded": "false"
          });

          // If the navigation is hidden
          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, {
              "aria-hidden": "true"
            });
            nav.style.position = "absolute";
          }

          // If the navigation is not hidden
          if (!nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, {
              "aria-expanded": "true"
            });
            setAttributes(navToggle, {
              "aria-expanded": "true"
            });
          }

          this._createStyles();
          this._calcHeight();
          opts.resizeMobile();

        } else {

          isMobile = false;
          setAttributes(navToggle, {
            "aria-hidden": "true"
          });
          setAttributes(nav, {
            "aria-hidden": "false"
          });
          nav.removeAttribute("aria-expanded");
          navToggle.removeAttribute("aria-expanded");
          nav.style.position = opts.openPos;
          this._removeStyles();
          opts.resizeDesktop();

        }
      },

      /**
       * Takes care of all even handling
       *
       * @param  {event} event
       * @return {type} returns the type of event that should be used
       */
      handleEvent: function(e) {
        var evt = e || window.event;

        switch (evt.type) {
          case "touchstart":
            this._onTouchStart(evt);
            break;
          case "touchmove":
            this._onTouchMove(evt);
            break;
          case "touchend":
          case "mouseup":
            this._onTouchEnd(evt);
            break;
          case "click":
            this._preventDefault(evt);
            break;
          case "keyup":
            this._onKeyUp(evt);
            break;
          case "focus":
          case "resize":
            this.resize(evt);
            break;
        }
      },

      /**
       * Initializes the widget
       */
      _init: function() {
        this.index = index++;

        addClass(nav, opts.navClass);
        addClass(nav, "closed");
        hasAnimFinished = true;
        navOpen = false;

        this._closeOnNavClick();
        this._createToggle();
        this._transitions();
        this.resize();

        // Enable more accessible dropdown menu
        this._createFocus();
        this._createDropdown();

        /**
         * On IE8 the resize event triggers too early for some reason
         * so it's called here again on init to make sure all the
         * calculated styles are correct.
         */
        var self = this;
        setTimeout(function() {
          self.resize();
        }, 20);

        addEvent(window, "resize", this, false);
        addEvent(window, "focus", this, false);
        addEvent(document.body, "touchmove", this, false);
        addEvent(navToggle, "touchstart", this, false);
        addEvent(navToggle, "touchend", this, false);
        addEvent(navToggle, "mouseup", this, false);
        addEvent(navToggle, "keyup", this, false);
        addEvent(navToggle, "click", this, false);

        /**
         * Init callback here
         */
        opts.init();
      },

      /**
       * Creates Styles to the <head>
       */
      _createStyles: function() {
        if (!styleElement.parentNode) {
          styleElement.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
      },

      /**
       * Removes styles from the <head>
       */
      _removeStyles: function() {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      },

      /**
       * Creates Navigation Toggle
       */
      _createToggle: function() {
        var toggle;

        if (opts.hamburger){
          toggle = document.createElement("button");
          toggle.classList.add("nav-toggle");
          toggle.classList.add("hamburger");
          toggle.classList.add(opts.hamburgerClass);

          setAttributes(toggle, {
            "type": "button",
            "aria-label": "Menu",
            "aria-controls": "navigation"
          });

          var hamburger = document.createElement("span");
          hamburger.classList.add("hamburger-box");

          var hamburgerInner = document.createElement("span");
          hamburgerInner.classList.add("hamburger-inner");

          var hamburgerLabel = document.createElement("span");
          hamburgerLabel.classList.add("hamburger-label");
          hamburgerLabel.innerHTML = opts.hamburgerLabel;

          hamburger.innerHTML = hamburgerInner.outerHTML;
          toggle.innerHTML = hamburger.outerHTML + hamburgerLabel.outerHTML;

          // Determine where to insert the toggle
          if (opts.insert === "after") {
            nav.parentNode.insertBefore(toggle, nav.nextSibling);
          } else {
            nav.parentNode.insertBefore(toggle, nav);
          }

          navToggle = toggle;

        } else {
          // If there's no toggle, let's create one
          if (!opts.customToggle) {
            toggle = document.createElement("a");
            toggle.innerHTML = opts.label;
            setAttributes(toggle, {
              "href": "#",
              "class": "nav-toggle"
            });

            // Determine where to insert the toggle
            if (opts.insert === "after") {
              nav.parentNode.insertBefore(toggle, nav.nextSibling);
            } else {
              nav.parentNode.insertBefore(toggle, nav);
            }

            navToggle = toggle;

            // There is a toggle already, let's use that one
          } else {
            var toggleEl = opts.customToggle.replace("#", "");

            if (document.getElementById(toggleEl)) {
              navToggle = document.getElementById(toggleEl);
            } else if (document.querySelector(toggleEl)) {
              navToggle = document.querySelector(toggleEl);
            } else {
              throw new Error("The custom nav toggle you are trying to select doesn't exist");
            }
          }
        }


      },

      /**
       * Closes the navigation when a link inside is clicked.
       */
      _closeOnNavClick: function() {
        if (opts.closeOnNavClick) {
          var links = nav.getElementsByTagName("a"),
            self = this;
          forEach(links, function(i, el) {
            addEvent(links[i], "click", function() {
              if (isMobile) {
                self.toggle();
              }
            }, false);
          });
        }
      },

      /**
       * Prevents the default functionality.
       *
       * @param  {event} event
       */
      _preventDefault: function(e) {
        if (!checkPassiveEventSupport) {
          if (e.preventDefault) {
            if (e.stopImmediatePropagation) {
              e.stopImmediatePropagation();
            }
            e.preventDefault();
            e.stopPropagation();
            return false;

            // This is strictly for old IE
          } else {
            e.returnValue = false;
          }
        }
      },

      /**
       * On touch start we get the location of the touch.
       *
       * @param  {event} event
       */
      _onTouchStart: function(e) {
        if (!Event.prototype.stopImmediatePropagation) {
          this._preventDefault(e);
        }
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.touchHasMoved = false;

        /**
         * Remove mouseup event completely here to avoid
         * double triggering the event.
         */
        removeEvent(navToggle, "mouseup", this, false);
      },

      /**
       * Check if the user is scrolling instead of tapping.
       *
       * @param  {event} event
       */
      _onTouchMove: function(e) {
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
          Math.abs(e.touches[0].clientY - this.startY) > 10) {
          this.touchHasMoved = true;
        }
      },

      /**
       * On touch end toggle the navigation.
       *
       * @param  {event} event
       */
      _onTouchEnd: function(e) {
        this._preventDefault(e);
        if (!isMobile) {
          return;
        }

        // Get event.target, the old IE way
        var thisEvent = e || window.event,
          targetEl = thisEvent.target || thisEvent.srcElement,
          isDropdownTapped = false;

        // Was it sub-navigation toggle or the main toggle?
        if (hasClass(targetEl, "dropdown-toggle") && opts.enableDropdown) {
          isDropdownTapped = true;
        }

        // If the user isn't scrolling
        if (!this.touchHasMoved) {

          // If the event type is touch
          if (e.type === "touchend") {

            // If sub-navigation toggle was tapped
            if (isDropdownTapped) {
              this._toggleDropdown(targetEl);

              // If the main toggle was tapped
            } else {
              this.toggle();
            }
            return;

            // Event type was click, not touch
          } else {
            var evt = e || window.event;

            // If it isn't a right click, do toggling
            if (!(evt.which === 3 || evt.button === 2)) {
              if (isDropdownTapped) {
                this._toggleDropdown(targetEl);
              } else {
                this.toggle();
              }
            }
          }
        }
      },

      /**
       * For keyboard accessibility, toggle the navigation on Enter
       * keypress too.
       *
       * @param  {event} event
       */
      _onKeyUp: function(e) {
        var evt = e || window.event,
          targetEl = e.target,
          isDropdownTapped = false;

        if (hasClass(targetEl, "dropdown-toggle") && opts.enableDropdown) {
          isDropdownTapped = true;
        }

        if (evt.keyCode === 13) {
          if (isDropdownTapped) {
            this._toggleDropdown(targetEl);
          } else {
            this.toggle();
          }
        }
      },

      /**
       * Adds the needed CSS transitions if animations are enabled
       */
      _transitions: function() {
        if (opts.animate) {
          var objStyle = nav.style,
            transition = "max-height " + opts.transition + "ms, visibility " + opts.transition + "ms linear";

          objStyle.WebkitTransition =
            objStyle.MozTransition =
            objStyle.OTransition =
            objStyle.transition = transition;
        }
      },

      /**
       * Calculates the height of the navigation and then creates
       * styles which are later added to the page <head>
       */
      _calcHeight: function() {
        var savedHeight = 0;
        for (var i = 0; i < nav.inner.length; i++) {
          savedHeight += nav.inner[i].offsetHeight;
        }

        var innerStyles = "." + opts.jsClass + " ." + opts.navClass + ".opened{max-height:" + savedHeight + "px !important} ." + opts.jsClass + " ." + opts.navClass + ".opened.dropdown-active {max-height:9999px !important}";

        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = innerStyles;
        } else {
          styleElement.innerHTML = innerStyles;
        }

        innerStyles = "";
      },

      /**
       * Creates 'focus' class on nav elements
       */
      _createFocus: function() {

        // Bail if focus is not enabled.
        if (!opts.enableFocus) {
          return;
        }

        // Get all the link elements within the menu.
        var menu = nav.getElementsByTagName("ul")[0];
        var links = menu.getElementsByTagName("a");
        var len;
        var i;

        // Each time a menu link is focused or blurred, toggle focus.
        for (i = 0, len = links.length; i < len; i++) {
          links[i].addEventListener("focus", toggleFocus, true);
          links[i].addEventListener("blur", toggleFocus, true);
        }

      },

      /**
       * Enable multi-level dropdown
       */
      _createDropdown: function() {

        // Bail if multiple level dropdown is not enabled.
        if (!opts.enableDropdown) {
          return;
        }

        var self = this;

        // Get submenus
        var subMenus = nav.getElementsByClassName(opts.subMenu);
        var i;
        var len;

        // Add .multiple-level-nav class to nav
        addClass(nav, "multiple-level-nav");

        // Add toggle button before sub menu.
        for (i = 0, len = subMenus.length; i < len; i++) {
          subMenus[i].insertAdjacentHTML("beforebegin", "<button class=\"dropdown-toggle\" aria-expanded=\"false\">" + opts.openDropdown + "</button>");
        }

        // Select all dropdown buttons
        dropdownButton = nav.querySelectorAll(".dropdown-toggle");

        // For each dropdown Button element add click event
        forEach(dropdownButton, function(i, el) {
          addEvent(el, "touchstart", self, false);
          addEvent(el, "touchend", self, false);
          addEvent(el, "mouseup", self, false);
          addEvent(el, "keyup", self, false);
          addEvent(el, "click", self, false);
        });

      },

      /**
       * Toggles sub-navigations open/closed
       *
       * @param  {element} The toggle that was tapped
       */
      _toggleDropdown: function(targetEl) {

        // Enable active class to let the navigation expand over
        // the calculated max height
        //addClass(nav, "dropdown-active");

        // Change dropdown button text on every click
        if (targetEl.innerHTML === opts.openDropdown) {
          targetEl.innerHTML = opts.closeDropdown;
        } else {
          targetEl.innerHTML = opts.openDropdown;
        }

        // Check if the sub-navigation is inside another sub-nav
        // var parentEl = targetEl.parentNode;
        // var isInsideSub = hasClass(parentEl.parentNode.parentNode, "dropdown");
        var nextElement;

        // Toggle dropdown button
        if (!hasClass(targetEl, "toggled")) {

          // Add .toggled class
          addClass(targetEl, "toggled");

          // Set aria-expanded to true
          targetEl.setAttribute("aria-expanded", "true");

          // Get next element meaning UL with .sub-menu class
          nextElement = targetEl.nextElementSibling;

          // Add "toggled" class to sub-menu element
          addClass(nextElement, "toggled");

          // Add "dropdown-active" class to nav when dropdown is toggled
          addClass(nav, "dropdown-active");

        } else {

          // Remove .toggled class
          removeClass(targetEl, "toggled");

          // Set aria-expanded to false
          targetEl.setAttribute("aria-expanded", "false");

          // Get next element meaning UL with .sub-menu
          nextElement = targetEl.nextElementSibling;

          // Remove "toggled" class from sub-menu element
          removeClass(nextElement, "toggled");

          // Remove "dropdown-active" class to nav when dropdown is toggled
          removeClass(nav, "dropdown-active");

        }

      },

    };

    /**
     * Return new Responsive Nav
     */
    return new ResponsiveNav(el, options);

  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = responsiveNav;
  } else {
    window.responsiveNav = responsiveNav;
  }

}(document, window, 0));