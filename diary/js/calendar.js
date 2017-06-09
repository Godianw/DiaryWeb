
$(function () {

    // 显示日期
    showDate();
});


/**
 * 显示日期
 */
function showDate() {
   
    // 获取系统时间
    var date = new Date();
    var year = parseInt("20" + date.getYear().toString().substring(1, 3));
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dayNumOfMonth = DayNumOfMonth(year, month);
    var firstDay = FirstDayOfMonth(year, month);

    document.getElementById('month').innerHTML = month + "月<br><span style=\"font-size:18px\">"
                                    + year + "</span>";

    document.getElementById('days').innerHTML = "";
    if (firstDay != 7)
    {
        for (var i = 1; i < firstDay - 1; ++ i)
        {
            document.getElementById('days').innerHTML += "<li></li>";
        }
    }
    for (var i = 1; i <= dayNumOfMonth; ++ i)
    {
        if (i != day)
            document.getElementById('days').innerHTML += "<li>" + i + "</li>";
        else
            document.getElementById('days').innerHTML += "<li><span class=\"active\">"
                                                    + i + "</span></li>";
    }
   
    
}

// 获取月份对应的天数
function DayNumOfMonth(Year, Month) {
    Month--;
    var d = new Date(Year, Month, 1);
    d.setDate(d.getDate() + 32 - d.getDate());
    return (32 - d.getDate());
}

// 获取月份对应的首日的星期数
function FirstDayOfMonth(Year, Month) {

    return new Date(Year, Month, 1).getDay();
}
