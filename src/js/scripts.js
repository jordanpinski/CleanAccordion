document.addEventListener('DOMContentLoaded', function(event) {

  // Polyfills
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  Object.prototype.Test = (options = {}) => { new Test(options) };
  let test = document.querySelector('h3');

  test.Test();
});
