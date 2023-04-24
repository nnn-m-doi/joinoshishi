

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
  const r = /(\d{2,3}):(\d\d)/.exec(string);
  const h = r ? parseInt(r[1]) : 0;
  const m = r ? parseInt(r[2]) : 0;

  return h * 60 + m;
}

function displayOverTimes() {
  const totalWorkMinutes = document.querySelectorAll("div#getuji_scroll > div > table > tbody > tr > td")[1].innerText * 8 * 60;
  const totalWorkMinutesIncludeToday = document.querySelectorAll("div#getuji_scroll > div > table > tbody > tr > td")[0].innerText * 8 * 60;
  const totalWorkTime = toMinutesFromString(document.querySelectorAll("div#getuji_scroll > div > table > tbody > tr > td")[3].innerText);

  const overMinutes = totalWorkTime - totalWorkMinutes;

  const overMinutesIncludeToday =  totalWorkMinutesIncludeToday - totalWorkTime;

  const showOver = toHourAndMinutesString(overMinutes);

  const showOverToday =  toHourAndMinutesString(overMinutesIncludeToday);

  const appendHeader = document.createElement("th");
  appendHeader.textContent = "今月の過不足時間";
  appendHeader.style.cssText = "color: #FFDDDD";
  const appendElement = document.createElement("td");
  appendElement.textContent = showOver;

  const appendHeader2 = document.createElement("th");
  appendHeader2.textContent = "今日の最短労働時間";
  appendHeader2.style.cssText = "color: #FFDDDD";
  const appendElement2 = document.createElement("td");
  appendElement2.textContent = showOverToday;

  document.querySelectorAll("div#getuji_scroll > div > table > thead > tr > th")[3].after(appendHeader2);
  document.querySelectorAll("div#getuji_scroll > div > table > tbody > tr > td")[3].after(appendElement2);

  document.querySelectorAll("div#getuji_scroll > div > table > thead > tr > th")[3].after(appendHeader);
  document.querySelectorAll("div#getuji_scroll > div > table > tbody > tr > td")[3].after(appendElement);
}

window.onload = displayOverTimes();