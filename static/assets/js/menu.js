(function () {
    var menu = document.getElementById('site-menu');
    var menuToggle = document.querySelector('.menu-toggle');
    var moreTrigger = document.querySelector('.menu__sub-inner-more-trigger');
    var moreMenu = document.querySelector('.menu__sub-inner-more');

    function closeMenu() {
        if (!menu || !menuToggle) return;
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function closeMore() {
        if (!moreMenu || !moreTrigger) return;
        moreMenu.classList.add('hidden');
        moreTrigger.setAttribute('aria-expanded', 'false');
    }

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            var open = menu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });
    }

    if (moreTrigger && moreMenu) {
        moreTrigger.addEventListener('click', function (event) {
            event.stopPropagation();
            var hidden = moreMenu.classList.toggle('hidden');
            moreTrigger.setAttribute('aria-expanded', String(!hidden));
        });
    }

    document.addEventListener('click', function (event) {
        closeMore();
        if (
            menu &&
            menuToggle &&
            menu.classList.contains('open') &&
            !menu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        closeMore();
        closeMenu();
    });

    window.addEventListener('resize', function () {
        if (window.matchMedia('(min-width: 684px)').matches) {
            closeMenu();
        }
    });
})();
