var check_username = 0;
var check_password = 0;
var check_password_again = 0;
var check_read = 0;
function zhanghao() {

    var user = document.getElementById("user").value;
    var label_zhanghao = document.getElementById("label_zhanghao");
    if (user.length < 6) {
        label_zhanghao.innerHTML = "不能小于6个字符";
        document.getElementById("image_zhanghao").src = "/Images/touming.png";
    }
    else {
        document.getElementById("image_zhanghao").src = "/Images/loading1.gif";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("post", "Server.aspx?check_user=" + user +
                     "&check=1");
        //设置回调函数
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                if (xmlHttp.responseText == "恭喜！该账号可注册") {
                    document.getElementById("image_zhanghao").src = "/Images/gou.png";
                    check_username = 1;
                }
                else
                    document.getElementById("image_zhanghao").src = "/Images/touming.png";
                label_zhanghao.innerText = xmlHttp.responseText;
            }
        }
        //发送请求
        xmlHttp.send(null);
    }
}
function mima() {
    var password = document.getElementById("password").value;
    if (password.length < 6)
        document.getElementById("label_password").innerText = "不能小于6个字符";
    else {
        document.getElementById("label_password").innerText = "";
        check_password = 1;
    }
}
function again() {
    var password = document.getElementById("password").value;
    var password_again = document.getElementById("password_again").value;
    if (password != password_again)
        document.getElementById("label_again").innerText = "两次输入密码不一致";
    else {
        document.getElementById("label_again").innerText = "";
        check_password_again = 1;
    }
}
function register() {
    if (document.getElementById("rule").checked == true)
        check_read = 1;
    if (check_username == 0 || check_password == 0 || check_password_again == 0 || check_read == 0)
        alert("请完善注册信息（必须同意条约）");
    else
    {
        var user = document.getElementById("user").value;
        var password = document.getElementById("password").value;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("post", "Server.aspx?register_user=" + user +
                     "&register_password=" + password + "&register=1");
        //设置回调函数
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {           
                alert(xmlHttp.responseText);
                window.open("Login.html","_parent");
            }
        }

        //发送请求
        xmlHttp.send(null);
    }
}