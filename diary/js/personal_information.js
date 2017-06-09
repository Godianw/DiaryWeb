window.onload = function () {

    var username = getUser();
    if (username == "") {
        window.location.href = "Login.html";
    }
    $('#username').html(username);

    $.ajax({
        type: 'POST',
        url: 'Server.aspx',
        async: false,
        data: {
            download_information: 1 
        },
        beforeSend: function () {

        },
        success: function (data) {

            var obj = new Function("return" + data)();//转换后的JSON对象
            document.getElementById("email").value = obj.email;
            document.getElementById("qq").value = obj.qq;
            document.getElementById("wechat").value = obj.wechat;
            document.getElementById("birthday").value = obj.birthday;
            document.getElementById("hometown").value = obj.hometown;
            document.getElementById("introduce").value = obj.introduce;
            document.getElementById("sex").value = obj.sex;
        },
        error: function (error) {
            alert('注销失败!');
        },
        complete: function () {

        } 
    });

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

function upload() {
    var email = document.getElementById("email").value;
    var qq = document.getElementById("qq").value;
    var wechat = document.getElementById("wechat").value;
    var birthday = document.getElementById("birthday").value;
    var sex = document.getElementById("sex").value;
    var hometown = document.getElementById("hometown").value;
    var introduce = document.getElementById("introduce").value;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("post", "Server.aspx?email=" + email + "&qq=" +
                qq + "&wechat=" + wechat + "&birthday=" + birthday + "&sex=" + sex +
                "&hometown=" + hometown + "&introduce=" + introduce + "&personal=1");

    //设置回调函数
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            alert(xmlHttp.responseText);
        }
    }
    //发送请求
    xmlHttp.send(null);


}

$(function () {
    $('#birthday').datetimepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        minView: "month"
    });
})

// 注销
function Logout() {

    $.ajax({
        type: 'POST',
        url: 'Server.aspx',
        async: true,
        data: {
            requestCode: 2 // requestCode为2，向服务端请求注销当前用户
        },
        beforeSend: function () {

        },
        success: function (result) {

            window.location.href = "Login.html";
        },
        error: function (error) {
            alert('注销失败!');
        },
        complete: function () {

        }
    });
};

// 修改密码
function setNewPwd() {

    var oldPwd = document.getElementById('oldPassword').value;
    var newPwd = document.getElementById('newPassword').value;
    var newPwd2 = document.getElementById('newPassword2').value;

    if (oldPwd == "") {
        alert("旧密码不能为空");
        return;
    }
    if (newPwd == "") {
        alert("新密码不能为空");
        return;
    }
    if (newPwd.length < 6 || newPwd.length > 16) {
        alert("密码长度必须为6~16位");
        return;
    }
    if (newPwd != newPwd2) {
        alert("两次输入的新密码不一致");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'Server.aspx',
        async: true,
        data: {
            oldPassword: oldPwd,
            newPassword: newPwd
        },
        beforeSend: function () {
            $('#loading').show();
        },
        success: function (msg) {

            if (msg == "Error")
                alert('修改失败!');
            else
                alert(msg);
        },
        error: function (error) {
            alert('修改失败!');
        },
        complete: function () {
            $('#loading').hide();
            clearInput();
            $('#modify_Pass').modal('hide');
        }
    });
}

// 清除模态框中的所填信息
function clearInput() {
    document.getElementById('oldPassword').value = "";
    document.getElementById('newPassword').value = "";
    document.getElementById('newPassword2').value = "";
}