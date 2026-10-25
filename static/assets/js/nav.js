(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  var breakpoint = window.matchMedia('(max-width: 760px)');

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') || event.target.closest('button')) {
      setOpen(false);
    }
  });

  document.addEventListener('click', function (event) {
    if (!isOpen()) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  if (breakpoint.addEventListener) {
    breakpoint.addEventListener('change', function () {
      if (!breakpoint.matches) setOpen(false);
    });
  } else {
    breakpoint.addListener(function () {
      if (!breakpoint.matches) setOpen(false);
    });
  }
})();
