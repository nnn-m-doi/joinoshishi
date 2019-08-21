(function () {
  function isAttendancePage() {
    const target = 'tms.kinnosuke.jp/app/attendance';
    const current = document.URL;
    return 0 <= current.indexOf(target);
  }

  function zerofill(number, digit) {
    return ('0' + number).slice(digit * -1);
  }

  function toHourAndMinutesString(minutes) {
    var tmp = '';

    tmp += minutes < 0 ? '-' : '';
    tmp += zerofill(Math.floor(Math.abs(minutes / 60)), 2);
    tmp += ':';
    tmp += zerofill(Math.floor(Math.abs(minutes % 60)), 2);

    return tmp;
  }

  async function displayOvertimes() {
    return Promise.resolve().then(() => {
      const tds = document.querySelectorAll('table#attendance_list > tbody > tr > td:nth-child(6)');
      return tds ? Promise.resolve(tds) : Promise.reject();
    }).then((tds) => {
      const minutes = Array.prototype.reduce.call(tds, (sum, el) => {
        const r = /(\d\d):(\d\d)/.exec(el.innerHTML);
        const h = r ? parseInt(r[1]) : 8;
        const m = r ? parseInt(r[2]) : 0;

        return sum + h * 60 + m - 8 * 60;
      }, 0);

      return Promise.resolve(minutes);
    }).then((minutes) => {
      const innerHTML = '今月の過不足時間' + toHourAndMinutesString(minutes);
      const fr = document.querySelector('.footer_right');
      const el = fr.querySelector('.overtime');

      if (el) {
        el.innerHTML = innerHTML;
      } else {
        const span = document.createElement('span');
        span.innerHTML = innerHTML;
        span.classList.add('overtime');
        fr.appendChild(span);
      }
    });
  }

  if (isAttendancePage()) {
    setInterval(displayOvertimes, 500);
  }

})();
