(function () {
  function isSubstring(longer, shorter) {
    return 0 <= longer.indexOf(shorter);
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

  function toMinutesFromString(string) {
    const r = /(\d\d):(\d\d)/.exec(string);
    const h = r ? parseInt(r[1]) : 0;
    const m = r ? parseInt(r[2]) : 0;

    return h * 60 + m;
  }

  async function displayOvertimes() {
    return Promise.resolve().then(() => {
      const isManager = document.querySelectorAll('table#attendance_list > thead > tr > th').length === 10;
      const trs = document.querySelectorAll('table#attendance_list > tbody > tr');

      const minutes = Array.prototype.reduce.call(trs, (sum, tr, index) => {
        const tdStartAt = tr.querySelector(`td:nth-child(${isManager ? 4 : 3})`);
        const tdEndAt = tr.querySelector(`td:nth-child(${isManager ? 5 : 4})`);
        const tdBreakTime = tr.querySelector(`td:nth-child(${isManager ? 6 : 5})`);

        const startAt = toMinutesFromString(tdStartAt.innerHTML);
        const endAt = toMinutesFromString(tdEndAt.innerHTML);
        const breakTime = toMinutesFromString(tdBreakTime.innerHTML);

        if (startAt !== 0 && endAt !== 0 && breakTime !== 0 && startAt < endAt) {
          return sum + endAt - startAt - breakTime - 8 * 60;
        } else {
          return sum;
        }
      }, 0);

      return trs ? Promise.resolve(minutes) : Promise.reject();
    }).then((minutes) => {
      const innerHTML = '今月の過不足時間' + toHourAndMinutesString(minutes);
      const fr = document.querySelector('.footer_right');
      const el = fr && fr.querySelector('.overtime');

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

  if (isSubstring(document.URL, 'tms.kinnosuke.jp/app/attendance')) {
    setInterval(displayOvertimes, 500);
  }

})();
