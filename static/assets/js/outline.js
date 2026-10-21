(function () {
  var outline = document.querySelector('.docs-outline');
  if (!outline) return;

  var links = Array.prototype.slice.call(outline.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function (link) {
    var id = decodeURIComponent(link.hash.slice(1));
    return document.getElementById(id);
  });
  var frame = 0;

  if (!targets.some(Boolean)) return;

  function update() {
    frame = 0;
    var root = document.documentElement;
    var end = root.scrollTop > 0 && root.scrollTop + window.innerHeight >= root.scrollHeight - 1;
    var passed = end ? targets : targets.filter(function (target) {
      if (!target) return false;
      var margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      return target.getBoundingClientRect().top <= margin + 1;
    });
    var current = passed[passed.length - 1];

    links.forEach(function (link, position) {
      if (targets[position] && targets[position] === current) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  update();
  window.addEventListener('resize', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
})();
