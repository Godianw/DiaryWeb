/* mylog.js */
var def_PageSize = 10;

window.onload = function () {

    $('#loading').hide();

    var def_curPage = 1;    // 当前页默认为1

    var username = getUser();
    if (username == "") {
        window.parent.location.href = "Login.html";
        return;
    }
    
    turnToPage(def_curPage);
}

function getUser() {

    var user = "";
    $.ajax({
        type: 'POST',
        url: 'Server.aspx',
        async: false,
        data: {
            requestCode: 1 // requestCode为1，向服务端请求当前用户的用户名
        },
        beforeSend: function () {

        },
        success: function (data) {
            if (data == "Error")
                user = "";
            else
                user = data;
        },
        error: function (error) {
            alert('登录状态异常，请重新登录!');
            user = "";
        },
        complete: function () {

        }
    });

    return user;
};

function showDiary(id) {

    window.location.href = "showDiary.html?id=" + id;
}

function editDiary(id) {
    
    window.location.href = "writeLog.html?id=" + id;
}

function delDiary(id) {

    if (!confirm("删除后将无法恢复，确认要删除吗?"))
        return;

    $.ajax({
        type: 'POST',
        url: 'WebService.aspx',
        async: false,
        data: {
            del_diary_id: id
        },
        beforeSend: function () {

            $('#loading').show();
        },
        success: function (data) {

            $('#loading').hide();

            if (data == "Error")
                alert("删除失败");
            else {
                alert("删除成功");
            }
        },
        error: function () {

            $('#loading').hide();

            alert("服务调用失败");
        },
        complete: function () {

            window.location.href = "myLog.html";
        }
    });
}

function turnToPage(def_curPage) {

    $.ajax({
        type: 'POST',
        url: 'WebService.aspx',
        async: false,
        data: {
            pageSize: def_PageSize,
            currentPage: def_curPage
        },
        beforeSend: function () {
            $('#loading').show();     
        },
        success: function (data) {
            document.getElementById("tbl_body").innerHTML = "";
            document.getElementById("pageDiv").innerHTML = "";

            if (data == "]" || data == "Error") {
                document.getElementById("tbl_body").innerHTML = "<tr><th>找不到相关记录</th></tr>";
                return;
            }

        //    alert(JSON.stringify(data));
            var totalCount;
            $.each($.parseJSON(data), function (index, obj) {
                totalCount = obj.totalCount;

                var html = "<tr><td><a href=\"javascript:void(0)\" onclick=\"showDiary("
                    + obj.diary_id + ")\">" + obj.diary_title + "</a></td><td>" + obj.diary_subtime
                    + "</td><td><a class=\"icon-edit\" href=\"javascript:void(0)\" "
                    + "onclick=\"editDiary(" + obj.diary_id + ")\">编辑</a></td>"
                    + "<td><a class=\"icon-remove\" href=\"javascript:void(0)\""
                    + " onclick=\"delDiary(" + obj.diary_id + ")\">删除</a></td></tr>";

                document.getElementById("tbl_body").innerHTML += html;
            });

            var pageCount = totalCount / 10 + ((totalCount % 10) > 0 ? 1 : 0);
            for (var i = 1; i <= pageCount; ++i) {
                var html = "<li><a href=\"javascript:void(0)\" onclick=\"turnToPage("
                    + i + ")\">" + i + "</a></li>";
                document.getElementById("pageDiv").innerHTML += html;
            }
        },
        error: function () {
            alert("页面错误");
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}