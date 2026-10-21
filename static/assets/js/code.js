(function () {
  document.querySelectorAll('pre').forEach(function (pre) {
    var wrapper = pre.closest('.code-block');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
    if (wrapper.querySelector('.code-block__header')) return;

    var code = pre.querySelector('code');
    var label = wrapper.dataset.title || pre.dataset.lang || (code && code.dataset.lang) || 'text';
    var header = document.createElement('div');
    header.className = 'code-block__header';

    var title = document.createElement('span');
    title.className = 'code-block__label';
    title.textContent = label;

    var copy = document.createElement('button');
    copy.className = 'code-block__copy';
    copy.type = 'button';
    copy.textContent = 'Copy';
    copy.addEventListener('click', function () {
      var text = (code || pre).textContent;
      navigator.clipboard.writeText(text).then(function () {
        copy.textContent = 'Copied';
        window.setTimeout(function () { copy.textContent = 'Copy'; }, 2000);
      }, function () {
        copy.textContent = 'Copy failed';
      });
    });

    header.appendChild(title);
    header.appendChild(copy);
    wrapper.insertBefore(header, wrapper.firstChild);
  });
})();
