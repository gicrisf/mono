(function () {
  var toggle = document.querySelector('.search-toggle');
  var popover = document.getElementById('search-popover');
  var input = document.getElementById('search');
  if (!toggle || !popover || !input) return;

  var notFound = popover.querySelector('.search-results__not-found');
  var results = popover.querySelector('.search-results');
  var list = popover.querySelector('.search-results__items');
  var index;
  var active = -1;
  var items = [];
  var timer;

  function open() {
    popover.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
    input.select();
  }

  function close() {
    popover.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function loadIndex() {
    if (index || !window.searchIndex) return index;
    index = elasticlunr.Index.load(window.searchIndex);
    return index;
  }

  function setActive(next) {
    active = next;
    items.forEach(function (item, position) {
      item.classList.toggle('is-selected', position === next);
    });
    if (items[next]) items[next].scrollIntoView({ block: 'nearest' });
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function teaser(body, terms) {
    var text = body.replace(/\s+/g, ' ').trim();
    var lower = text.toLowerCase();
    var words = terms.filter(Boolean).map(function (term) { return term.toLowerCase(); });
    var first = Infinity;

    words.forEach(function (word) {
      var position = lower.indexOf(word);
      if (position >= 0 && position < first) first = position;
    });

    var start = isFinite(first) ? Math.max(0, first - 60) : 0;
    var slice = text.slice(start, start + 220);
    var fragment = document.createDocumentFragment();

    if (start > 0) fragment.appendChild(document.createTextNode('…'));
    if (!words.length) {
      fragment.appendChild(document.createTextNode(slice));
    } else {
      var pattern = new RegExp('(' + words.map(escapeRegExp).join('|') + ')', 'gi');
      slice.split(pattern).forEach(function (part, position) {
        if (!part) return;
        if (position % 2) {
          var mark = document.createElement('b');
          mark.textContent = part;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });
    }
    if (start + 220 < text.length) fragment.appendChild(document.createTextNode('…'));

    return fragment;
  }

  function search(value) {
    var term = value.trim();
    if (!term) {
      results.hidden = true;
      notFound.hidden = true;
      list.replaceChildren();
      items = [];
      return;
    }

    var current = loadIndex();
    if (!current) {
      results.hidden = true;
      notFound.textContent = 'The search index did not load.';
      notFound.hidden = false;
      return;
    }

    var matches = current.search(term, {
      bool: 'AND',
      fields: {
        body: { boost: 1 },
        title: { boost: 2 },
      },
    });
    var terms = term.split(/\s+/);
    list.replaceChildren();
    items = [];

    if (!matches.length) {
      results.hidden = true;
      notFound.textContent = 'No results found.';
      notFound.hidden = false;
      return;
    }

    notFound.hidden = true;
    results.hidden = false;

    matches.slice(0, 10).forEach(function (match, position) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      var title = document.createElement('span');
      var snippet = document.createElement('span');

      link.className = 'search-result';
      link.href = match.ref;
      title.className = 'search-result__title';
      title.textContent = match.doc.title;
      snippet.className = 'search-result__snippet';
      snippet.appendChild(teaser(match.doc.body, terms));
      link.appendChild(title);
      link.appendChild(snippet);
      item.appendChild(link);
      item.addEventListener('pointermove', function () { setActive(position); });
      list.appendChild(item);
      items.push(link);
    });

    setActive(0);
  }

  toggle.addEventListener('click', function () {
    if (popover.classList.contains('hidden')) open();
    else close();
  });

  popover.addEventListener('click', function (event) {
    if (event.target === popover) close();
  });

  input.addEventListener('input', function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { search(input.value); }, 150);
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!items.length) return;
      var step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((active + step + items.length) % items.length);
    } else if (event.key === 'Enter' && items[active]) {
      event.preventDefault();
      window.location.href = items[active].href;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      toggle.focus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (popover.classList.contains('hidden')) open();
      else close();
      return;
    }

    if (event.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      event.preventDefault();
      open();
    }
  });
})();
