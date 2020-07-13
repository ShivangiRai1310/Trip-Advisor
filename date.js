module.exports = {currentDate,DMY};

function currentDate() {

    let today = new Date(),
        day = today.getDate(),
        month = today.getMonth() + 1, //January is 0
        year = today.getFullYear();
    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    today = year + '-' + month + '-' + day;
    
    return today;  
}

function DMY() {
    var year, month, day;
    var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    year = String(this.getFullYear());
    month = String(this.getMonth());
    // if (month.length == 1) {
    //     month = "0" + month;
    // }
    day = String(this.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return day + " " + monthShortNames[month] + " " + year;
};
