const dates = document.querySelectorAll(".date");

// Date Format
function dateFormat(date) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}

for (let i = 0; i < dates.length; i++) {
    dates[i].innerHTML = dateFormat(dates[i].innerHTML)
}