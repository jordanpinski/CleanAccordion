const NAME = "CleanAccordion";
const VERSION = "1.0.0";

class CleanAccordion {
  constructor(cleanAccordionGroups = [], options = {}) {
    this.cleanAccordionGroups = cleanAccordionGroups;
    if (this.cleanAccordionGroups.length <= 0) return;

    const defaultOptions = {
      _name: NAME,
      _version: VERSION,
      singleOpen: true,                 // Should only one accordion be open at a time?
      beforeOpen: (accordion) => {},
      afterOpen: (accordion) => {},
      beforeClose: (accordion) => {},
      afterClose: (accordion) => {}
    }

    this.options = { ...defaultOptions, ...options }
    this.handleResize = this.debounce(this.handleResize.bind(this), 100);
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

  handleAccordionClick(event) {
    let target = event.target;
    let accordion = target.parentNode

    // 1. Check if the title was clicked
    if (target.hasAttribute('data-title')) {

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
    if (accordion.classList.contains('open')) {
      this.close(accordion);
    } else {
      this.open(accordion);
    }
  }

  calculateContentHeight(content) {
    if (!content.parentNode.classList.contains('open')) return;
    let height = 0;

    const children = Array.prototype.slice.call(content.children);

    children.forEach( (child) => {
      height += child.scrollHeight;

      // Add the top margin of first child
      let firstChildStyle = child.children[0].currentStyle || window.getComputedStyle(child.children[0]);
      let firstChildHeight = parseInt(firstChildStyle.marginTop.replace('px', ''));
      height += firstChildHeight;
    });
      
    content.style.maxHeight = `${height}px`;
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