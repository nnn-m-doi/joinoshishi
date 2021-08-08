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

  function findElementIndex(array, callback) {
    for (let i = 0; i < array.length; ++i) {
      if (callback(array[i], i, array)) {
        return i;
      }
    }
  }

  async function displayOvertimes() {
    return Promise.resolve().then(() => {
      const ths = document.querySelectorAll('table#attendance_list > thead > tr > th');
      const trs = document.querySelectorAll('table#attendance_list > tbody > tr');

      const tdStartAtIndex = findElementIndex(ths, (el, i) => {
        return isSubstring(el.innerHTML, "出勤時刻");
      });

      const tdEndAtIndex = findElementIndex(ths, (el, i) => {
        return isSubstring(el.innerHTML, "退勤時刻");
      });

      const tdBreakTimeAtIndex = findElementIndex(ths, (el, i) => {
        return isSubstring(el.innerHTML, "所定休憩時間");
      });

      const minutes = Array.prototype.reduce.call(trs, (sum, tr, index) => {
        const tdStartAt = tr.children[tdStartAtIndex];
        const tdEndAt = tr.children[tdEndAtIndex];
        const tdBreakTime = tr.children[tdBreakTimeAtIndex];

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
