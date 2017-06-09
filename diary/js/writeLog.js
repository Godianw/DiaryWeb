/* writeLog.js */
var editor;

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

KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        width : "100%",
		resizeType : 0, // 不能拖动文本区域
		allowPreviewEmoticons : false,
		allowImageUpload : false,
		items : [
			'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
			'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
			'insertunorderedlist', '|', 'emoticons', 'image', 'link'],
		afterChange : function() {
			K('.word_count').html(1000 - this.count('text'));
			var limitNum = 1000;  //设定限制字数
			if (this.count('text') > 1000) {
				$('#lab_TextLimit').attr("style","color:red");
			}
			else {
				$('#lab_TextLimit').attr("style","color:black");
			}
		}
	});
});

function loadDiary() {

    var url = window.location.search;

    if (url == "") {
        $('#submitBtn').show();
        $('#saveBtn').hide();
    }
    else {
        $('#submitBtn').hide();
        $('#saveBtn').show();
    }

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

            if (data == "Error")
                alert("日志加载失败");
            else {

                var obj = new Function("return" + data)();//转换后的JSON对象
                document.getElementById("title").value = obj.title;
                editor.html(obj.content);

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

function delHtmlTag(str) {
    //去掉所有的html标记
    return str.replace(/<[^>]+>/g, "");
}

function submitLog() {
	
	// 获取日志标题
	var title = document.getElementById('title').value;
	// 获取日志内容
	var content = editor.html();
	content = content.replace(/\t/g, " ");
	content = content.replace(/\n/g, " ");

	if (content == "")
	{
	    alert('日志内容不能为空');
	    return;
	}
	
	// 若无标题则取日志中的前n位
	if (title == "")
	{
		var titleLength = 14;
		editor.sync();
		var content_noHtml = delHtmlTag(document.getElementById('editor').value); // 原生API
		content_noHtml = content_noHtml.replace(/\t/g, " ");
		content_noHtml = content_noHtml.replace(/\n/g, " ");
		title = content_noHtml.substring(0, titleLength - 1);
	}

	$.ajax({
	    type: 'POST',
	    url: 'WebService.aspx',
	    async: false,
	    data: {
	        diary_title: title,
            diary_content: content
	    },
	    beforeSend: function () {
	        
	        $('#loading').show();
	    },
	    success: function (data) {

	        $('#loading').hide();

	        if (data == "Success")
	        {
	            alert("日志发表成功");
	            parent.location.reload();
	        }   
            else
                alert("日志发表失败")
	    },
	    error: function () {

	        $('#loading').hide();

	        alert("服务调用失败");
	    },
	    complete: function () {

	        
	    }
	});
}

function saveLog() {

    // 获取日志id
    var url = window.location.search;
    var id = "";
    if (url != null) {
        id = url.split("=")[1];
    }
    else
        return;
    // 获取日志标题
    var title = document.getElementById('title').value;
    // 获取日志内容
    var content = editor.html();
    content = content.replace(/\t/g, " ");
    content = content.replace(/\n/g, " ");

    if (content == "") {
        alert('日志内容不能为空');
        return;
    }

    // 若无标题则取日志中的前n位
    if (title == "") {
        var titleLength = 14;
        editor.sync();
        var content_noHtml = delHtmlTag(document.getElementById('editor').value); // 原生API
        content_noHtml = content_noHtml.replace(/\t/g, " ");
        content_noHtml = content_noHtml.replace(/\n/g, " ");
        title = content_noHtml.substring(0, titleLength - 1);
    }

    $.ajax({
        type: 'POST',
        url: 'WebService.aspx',
        async: false,
        data: {
            diary_id: id,
            diary_title: title,
            diary_content: content
        },
        beforeSend: function () {

            $('#loading').show();
        },
        success: function (data) {

            $('#loading').hide();

            if (data == "Success") {
                alert("日志保存成功");
                parent.location.reload();
            }
            else
                alert("日志保存失败")
        },
        error: function () {

            $('#loading').hide();

            alert("服务调用失败");
        },
        complete: function () {


        }
    });
}
