// TODO: Add aria support

/**
 * Entry point to the plugin.
 */
class CleanAccordion {
  constructor(cleanAccordionGroups = [], options = {}) {
    this.cleanAccordionGroups = cleanAccordionGroups;
    if (this.cleanAccordionGroups.length <= 0) return;

    const defaultOptions = {
      _name: "CleanAccordion",
      _version: "1.0.0",
      singleOpen: true,                 // Should only one accordion be open at a time?
      beforeOpen: (accordion) => {},
      afterOpen: (accordion) => {},
      beforeClose: (accordion) => {},
      afterClose: (accordion) => {}
    }

    this.options = { ...defaultOptions, ...options }
    this.debounceTime = 100;
    this.handleResize = this.debounce(this.handleResize.bind(this), this.debounceTime);
    this.openClose = this.debounce(this.openClose.bind(this), this.debounceTime);
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {

    // cleanAccordionGroup click events
    this.cleanAccordionGroups.forEach( (cleanAccordion) => {
      cleanAccordion.addEventListener('click', (event) => { this.handleAccordionClick(event) });
    });

    // Resizing
    window.addEventListener('resize', () => { this.handleResize() })
  }

  // TODO: Event is being called more than once when a nested accordion
  handleAccordionClick(event) {
    let target = event.target;
    let accordion = target.parentNode

    // 1. Check if the title was clicked
    if (target.hasAttribute('data-control')) {

      // 2. Open/Close the accordion
      this.openClose(accordion);

    }
  }

  handleResize() {
    this.cleanAccordionGroups.forEach( (cleanAccordionGroup) => {
      const contents = cleanAccordionGroup.querySelectorAll('[data-content]');
      contents.forEach( content => {
        this.calculateContentHeight(content);
      });
    });
  }

  openClose(accordion) {
    let timeSinceLastOpenClose = this.debounceFallback(accordion);

    if (timeSinceLastOpenClose < this.debounceTime) return;

    if (accordion.classList.contains('open')) {
      this.close(accordion);
    } else {
      this.open(accordion);
    }
  }

  /**
   * 
   */
  debounceFallback(accordion) {
    let timestamp = Date.now();
    let existingTimeStamp = false;

    if (accordion.hasAttribute('data-timestamp')) {
      existingTimeStamp = accordion.dataset.timestamp;
      accordion.dataset.timestamp = timestamp;
    } else {
      accordion.dataset.timestamp = timestamp;
    }

    return timestamp - existingTimeStamp;
  }

  calculateContentHeight(content) {
    if (!content.parentNode.classList.contains('open')) return;

    // 1. Set content height
    content.style.maxHeight = `${content.scrollHeight}px`;

    // 2. If this is a nested accordion group recalculate all parent [data-content]
    let tempContent = content.parentNode.closest('[data-content]');
    while (tempContent !== null) {
      tempContent.style.maxHeight = `${tempContent.scrollHeight + content.scrollHeight}px`;
      tempContent = tempContent.parentNode.closest('[data-content]');
    }

  }
  
  /**
   * Returns the computed height including margin of the passed element
   * @param {object} element 
   */
  getComputedHeight(element) {
    let height = element.scrollHeight
    let computedStyle = window.getComputedStyle(element);
    let marginTop = parseInt(computedStyle.marginTop.replace('px', ''));
    let marginBottom = parseInt(computedStyle.marginBottom.replace('px', ''));
    return height + marginTop + marginBottom;
  }

  resetContentHeight(content) {
    content.style.maxHeight = '';
  }

  /**
   * Open an accordion
   * @param {*} accordion The accordion to open 
   */
  open(accordion) {
    // 1. beforeOpen callback
    this.options.beforeOpen(accordion);

    // 2. Check option conditionals.
    this.closeAll(accordion);

    // 3. Open accordion
    let content = accordion.querySelector('[data-content]');
    accordion.classList.add('open');
    this.calculateContentHeight(content);
    
    // 4. afterOpen callback
    this.options.afterOpen(accordion);
  }

  /**
   * Close an accordion
   * @param {*} accordion The accordion to close
   */
  close(accordion) {

    // 1. beforeClose callback
    this.options.beforeClose(accordion);

    // 2. Close accordion
    let content = accordion.querySelector('[data-content]');
    accordion.classList.remove('open');
    this.resetContentHeight(content);

    // 3. afterClose callback
    this.options.afterClose(accordion);
  }

  /**
   * Closes each accordion.
   * @param {*} accordion The current accordion.
   */
  closeAll(accordion) {

    // 1. Check if data options were passed.
    let accordionGroup = accordion.parentNode;
    let dataOptions = this.getDataOptions(accordionGroup);

    if ('singleOpen' in dataOptions) {
      if (dataOptions.singleOpen === false) return;
    } else {
      if (!this.options.singleOpen) return;
    }

    // 2. Proceed closing accordions
    let accordions = accordionGroup.querySelectorAll('[data-accordion]');

    accordions.forEach( (accordion) => {
      this.close(accordion);
    });
  }

  getDataOptions(accordionGroup) {
    let dataOptions = {};
    if (accordionGroup.hasAttribute('data-options')) {
      dataOptions = JSON.parse(accordionGroup.dataset.options);
    }
    return dataOptions;
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
}