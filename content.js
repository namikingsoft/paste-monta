const trim = str => str
  .replace(/^[ 　]*/gim, '')
  .replace(/[ 　]*$/gim, '')
  .replace(/[\n]*$/gim, '')
  .replace(/[\r\n]*$/gim, '')
;

const createMontaElement = () => {
  const monta = document.createElement('div');
  monta.setAttribute('class', 'paste-monta__monta');
  monta.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    monta.classList.add('removing');
    setTimeout(() => monta.remove(), 350);
  })
  return monta;
};

const parseMontas = montas => {
  let locationFilter;
  return trim(montas).split(/\r?\n/).map(trim).filter(selector => {
    if (selector.match(/^<([^>]+)>$/)) {
      locationFilter = RegExp.$1;
      return;
    }
    if (!selector) return;
    if (locationFilter && location.href.indexOf(locationFilter) < 0) return;
    return true;
  });
};

const parseStyles = styles => {
  let locationFilter;
  return trim(styles).split(/\r?\n/).map(trim).reduce((acc, line) => {
    if (line.match(/^<([^>]+)>$/)) {
      locationFilter = RegExp.$1;
      return acc;
    }
    if (!line) return acc;
    if (locationFilter && location.href.indexOf(locationFilter) < 0) return acc;
    return `${acc}${line}`;
  }, '').split(`}`).join(`}\n`).split(`\n`).filter(x => trim(x).length > 0);
};

chrome.runtime.sendMessage('getStorage', ({ montas, styles }) => {
  const style = document.createElement('style');
  style.setAttribute("type", "text/css");
  document.head.appendChild(style);
  parseMontas(montas).forEach(selector => {
    style.sheet.insertRule(`${selector} { visibility: hidden; }`, 0);
  });
  parseStyles(styles).forEach(rule => {
    console.log(rule);
    style.sheet.insertRule(rule, 0);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage('getStorage', ({ montas }) => {
    parseMontas(montas).forEach(selector => {
      const polling = () => {
        [].forEach.call(document.querySelectorAll(selector), element => {
          if( element.style.visibility === 'visible') return;
          const monta = createMontaElement();
          element.style.position = 'relative';
          element.style.visibility = 'visible';
          element.appendChild(monta);
        });
        setTimeout(polling, 500);
      };
      polling();
    });
  });
});
