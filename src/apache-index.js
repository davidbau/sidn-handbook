/* From https://github.com/Vestride/fancy-index/blob/main/script.js

Modified.

Stylesheet and javascript designed to be used with the following
Apache FancyIndexing directives.

    <Directory ...>
        ServerSignature off
        IndexOptions IgnoreCase FancyIndexing HTMLTable SuppressRules
        IndexOptions FoldersFirst VersionSort NameWidth=* DescriptionWidth=*
        IndexOptions XHTML IconHeight=16 IconWidth=16
        IndexStyleSheet "/apache-index.css"
        IndexHeadInsert "<meta charset=\"utf-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><script src=\"//baulab.info/apache-index.js\"></script>"
    </Directory>

The MIT License (MIT)

Copyright (c) 2014 Glen Cheney

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function() {

  function fixTable() {
    const table = document.querySelector('table');

    // Remove <hr>s
    Array.from(table.querySelectorAll('hr')).forEach(({ parentNode }) => {
      const row = parentNode.parentNode;
      row.parentNode.removeChild(row);
    });

    // Make a table head.
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    firstRow.parentNode.removeChild(firstRow);
    thead.appendChild(firstRow);
    table.insertBefore(thead, table.firstElementChild);

    // Remove the first column and put the image in the next.
    const rows = Array.from(table.querySelectorAll('tr'));
    rows.forEach((row) => {
      const iconColumn = row.children[0];
      const fileColumn = row.children[1];

      // Remove icon column.
      row.removeChild(iconColumn);

      const image = iconColumn.firstElementChild;

      if (!image) {
        return;
      }

      // Wrap icon in a div.img-wrap.
      const div = document.createElement('div');
      div.className = 'img-wrap';
      div.appendChild(image);

      // Insert icon before filename.
      fileColumn.insertBefore(div, fileColumn.firstElementChild);
    });
  }

  // Underscore string's titleize.
  function titleize(str) {
    return decodeURI(str).toLowerCase().replace(/(?:^|\s|-)\S/g, c => c.toUpperCase());
  }

  function addTitle() {
    let path = window.location.pathname.replace(/\/$/g, '');
    let titleText;

    if (path) {
      const parts = path.split('/');
      path = parts[parts.length - 1];
      titleText = path; // titleize(path).replace(/-|_/g, ' ');
    } else {
      titleText = window.location.host;
    }

    titleText = `Index of ${titleText}`;

    let oldTitle = document.getElementById('indextitle');
    if (oldTitle) {
     oldTitle.remove();
    }

    const container = document.createElement('div');
    container.id = 'page-header';
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(titleText));
    container.appendChild(h1);

    document.body.insertBefore(container, document.body.firstChild);
    document.title = titleText;
  }

  /**
   * Get the value and unit to use for RelativeTimeFormat.
   * @param {number} seconds Difference in seconds between two dates.
   */
  function getTimeFormatArgs(seconds) {
    const absoluteSeconds = Math.abs(seconds);
    if (absoluteSeconds > 60 * 60 * 24 * 365) {
      return { value: seconds / (60 * 60 * 24 * 365), unit: 'year' };
    }

    if (absoluteSeconds > 60 * 60 * 24 * 30) {
      return { value: seconds / (60 * 60 * 24 * 30), unit: 'month' };
    }

    if (absoluteSeconds > 60 * 60 * 24) {
      return { value: seconds / (60 * 60 * 24), unit: 'day' };
    }

    if (absoluteSeconds > 60 * 60) {
      return { value: seconds / (60 * 60), unit: 'hour' };
    }

    if (absoluteSeconds > 60) {
      return { value: seconds / 60, unit: 'minute' };
    }

    return { value: seconds, unit: 'second' };
  }

  /**
   * Convert the date output from the server to a Date instance.
   * @param {string} str Date string from the server.
   * @return {Date | null}
   */
  function getDateFromString(str) {
    if (!str) {
      return null;
    }

    // 2014-12-09 10:43 -> 2014, 11, 09, 10, 43, 0.
    const parts = str.split(' ');
    const day = parts[0].split('-');
    const timeOfDay = parts[1].split(':');
    const year = parseInt(day[0], 10);
    const month = parseInt(day[1], 10) - 1;
    const _day = parseInt(day[2], 10);
    const hour = parseInt(timeOfDay[0], 10);
    const minutes = parseInt(timeOfDay[1], 10);

    return new Date(Date.UTC(year, month, _day, hour, minutes, 0));
  }

  function fixTime() {
    const hasRelativeTimeFormatter = 'RelativeTimeFormat' in Intl;
    if (!hasRelativeTimeFormatter) return;

    const formatter = new Intl.RelativeTimeFormat();
    const now = Date.now();

    Array.from(document.querySelectorAll('tbody .indexcollastmod')).forEach((date, i) => {
      const lastModified = getDateFromString(date.textContent.trim());

      if (lastModified && !Number.isNaN(lastModified)) {
        const difference = Math.round((lastModified.getTime() - now) / 1000);
        const relativeFormat = getTimeFormatArgs(difference);
        date.textContent = formatter.format(Math.round(relativeFormat.value), relativeFormat.unit);
        if (lastModified.getTime() < -2145916800000) {
          date.textContent = 'undated';
        }
        date.title = lastModified;
        date.setAttribute('data-sort', lastModified.getTime());
      }
    });
  }

  function getBytesFromString(s) {
    const units = {K: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15};
    return parseFloat(s) * (units[s.slice(-1)] || 1.0);
  }

  function fixSize() {
    Array.from(document.querySelectorAll('tbody .indexcolsize')).forEach((size, i) => {
      const bytes = getBytesFromString(size.textContent.trim());
      size.setAttribute('data-sort', Number.isNaN(bytes) ? -1 : bytes);
    });
  }

  function overrideSort() {
    // https://stackoverflow.com/a/49041392/265298
    function getCellValue(tr, idx) {
      return tr.children[idx].getAttribute('data-sort') ||
             tr.children[idx].innerText || tr.children[idx].textContent || '';
    }
    function isdir(r) {
      const a = r.querySelector('a');
      return a && a.href.endsWith('/');
    }
    function comparer(idx, asc) {
      function compare(a, b) {
        if (isdir(a) != isdir(b)) return isdir(a) ? -1 : 1;
        const v1 = getCellValue(asc ? a : b, idx);
        const v2 = getCellValue(asc ? b : a, idx);
        if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) return v1 - v2;
        return v1.toString().localeCompare(v2, undefined, {numeric: true, sensitivity: 'base'});
      }
      return compare;
    }
    document.querySelectorAll('thead a').forEach(a => a.addEventListener('click', ((ev) => {
      const table = a.closest('table'), th = a.closest('th');
      Array.from(table.querySelectorAll('tbody tr'))
           .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
           .forEach(tr => table.tBodies[0].appendChild(tr) );
      ev.preventDefault();
    })));
  }

  function addSearch() {
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'apache-index-search';
    input.setAttribute('placeholder', 'Search');
    document.getElementById('page-header').appendChild(input);

    const sortColumns = Array.from(document.querySelectorAll('thead a'));
    const nameColumns = Array.from(document.querySelectorAll('tbody .indexcolname'));
    const descColumns = Array.from(document.querySelectorAll('tbody .indexcoldesc'));
    const rows = nameColumns.map(({ parentNode }) => parentNode);
    const indexText = nameColumns.map(({ textContent }, i) =>
          textContent + ' ' + descColumns[i].textContent);

    function filter(value) {
      // Allow tabbing out of the search input and skipping the sort links
      // when there is a search value.
      sortColumns.forEach((link) => {
        if (value) {
          link.tabIndex = -1;
        } else {
          link.removeAttribute('tabIndex');
        }
      });

      // Test the input against the file/folder name and description.
      let even = false;
      indexText.forEach((name, i) => {
        if (!value || name.toLowerCase().includes(value.toLowerCase())) {
          const className = even ? 'even' : '';
          rows[i].className = className;
          even = !even;
        } else {
          rows[i].className = 'hidden';
        }
      });
    }

    input.addEventListener('input', ({ target }) => {
      filter(target.value);
    });

    filter('');
  }

  function domReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
    // If late; I mean on time.
    if (document.readyState === "interactive" || document.readyState === "complete" ) {
      fn();
    }
  }

  domReady(function() {
    fixTable();
    addTitle();
    fixTime();
    fixSize();
    addSearch();
    overrideSort();
    if (location.hostname.startsWith('papers.')) {
      document.querySelector('.indexcollastmod a').click();
    }
  });
})();
