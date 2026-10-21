(function () {
  document.querySelectorAll('[data-tabs]').forEach(function (group, groupIndex) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll(':scope > .tab'));
    if (!tabs.length) return;

    group.classList.add('tabs--enhanced');

    var list = document.createElement('div');
    list.className = 'tabs__list';
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Variants');

    var buttons = tabs.map(function (tab, index) {
      var title = tab.querySelector('.tab__title');
      var id = 'tabs-' + groupIndex + '-' + index;
      var panelId = id + '-panel';

      tab.id = panelId;
      tab.hidden = index !== 0;
      tab.setAttribute('aria-labelledby', id);
      tab.setAttribute('role', 'tabpanel');

      var button = document.createElement('button');
      button.className = 'tabs__tab';
      button.id = id;
      button.type = 'button';
      button.textContent = title ? title.textContent.trim() : 'Tab ' + (index + 1);
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-selected', String(index === 0));
      button.setAttribute('role', 'tab');
      button.tabIndex = index === 0 ? 0 : -1;

      button.addEventListener('click', function () { select(index); });
      button.addEventListener('keydown', function (event) {
        var next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;

        event.preventDefault();
        select(next, true);
      });

      list.appendChild(button);
      return button;
    });

    group.insertBefore(list, group.firstChild);

    function select(selected, focus) {
      tabs.forEach(function (tab, index) {
        var current = index === selected;
        tab.hidden = !current;
        buttons[index].setAttribute('aria-selected', String(current));
        buttons[index].tabIndex = current ? 0 : -1;
        if (current && focus) buttons[index].focus();
      });
    }
  });
})();
