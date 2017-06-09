/* showDiary.js */

window.onload = function () {

    $('#loading').hide();

    var username = getUser();
    if (username == "") {
        window.parent.location.href = "Login.html";
        return;
    }

    loadDiary();
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

// 获取当前用户的用户名
function getCurrentUser() {

    var username = "";
    $.ajax({
        type: 'POST',
        url: 'Server.aspx',
        async: true,
        data: {
            requestCode: 1 // requestCode为1，向服务端请求当前用户的用户名
        },
        beforeSend: function () {

        },
        success: function (data) {
            console.log(data);
            if (data == "Error")
                username = "";
            username = data;
        },
        error: function (error) {
            alert('页面出错!');
            username = "";
        },
        complete: function () {

        }
    });

    return username;
}

function loadDiary() {

    var url = window.location.search;

    var id = "";
    if (url != null) {
        id = url.split("=")[1];
    }
    if (id == "") {
        alert("找不到该日志，该日志可能已经删除.");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'WebService.aspx',
        async: false,
        data: {
            diary_id: id
        },
        beforeSend: function () {

            $('#loading').show();
        },
        success: function (data) {

            $('#loading').hide();

            if (data == "error")
                alert("日志加载失败");
            else {

                var obj = new Function("return" + data)();//转换后的JSON对象
                document.getElementById("title").innerHTML = obj.title;
                document.getElementById("subtime").innerHTML = "发表于" + obj.subtime;
                document.getElementById("content").innerHTML = obj.content;
            }
        },
        error: function () {

            $('#loading').hide();

            alert("服务调用失败");
        },
        complete: function () {


        }
    });
}

function editDiary() {

    var url = window.location.search;

    var id = "";
    if (url != null) {
        id = url.split("=")[1];
    }
    if (id == "") {
        alert("找不到该日志，该日志可能已经删除.");
        return;
    }

    window.location.href = "writeLog.html?id=" + id;
}

function delDiary() {

    if (!confirm("删除后将无法恢复，确认要删除吗?"))
        return;

    var url = window.location.search;

    var id = "";
    if (url != null) {
        id = url.split("=")[1];
    }
    if (id == "") {
        alert("找不到该日志，该日志可能已经删除.");
        return;
    }

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