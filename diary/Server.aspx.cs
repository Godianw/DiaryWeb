using diary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace RiZhi
{
    public partial class Server : System.Web.UI.Page
    {
        DataClasses1DataContext ta = new DataClasses1DataContext();
        protected void Page_Load(object sender, EventArgs e)
        {
            string requestCode = Request.Form["requestCode"];
            string loginCode = Request.QueryString["login"];
            string checkCode = Request.QueryString["check"];
            string registerCode = Request.QueryString["register"];
            string oldPwd = Request.Form["oldPassword"];
            string newPwd = Request.Form["newPassword"];
            if (Request.QueryString["personal"] == "1")
                update_personal_information();
            if (Request.Form["download_information"] == "1")
                personal_information();

            Response.Clear();

            if (loginCode == "1")
                login();
            if (checkCode == "1")
                check();
            if (registerCode == "1")
                register();
            
            // 向客户端返回当前用户的用户名
            if (requestCode == "1")
            {
                ResponseCurrentUser();
            }
            // 注销
            else if (requestCode == "2")
            {
                Logout();
            }

            // 修改密码
            if (oldPwd != null)
            {
                ModifyPwd(oldPwd, newPwd);
            }
        }
        //登录
        public void login()
        {
            string user = Request.QueryString["user"];
            string password = Request.QueryString["password"];
            var query = from s
                        in ta.Users_Linq
                        where s.user_name == user && s.user_password == password
                        select s;
            if (query.Count() >= 1)
            {
                Session["username"] = user;
                Response.Write("登录成功");
            }
            else
                Response.Write("账号或密码错误");
            Response.End();
        }
        // 检查账号是否被用过
        public void check()
        {
            string user=Request.QueryString["check_user"];
            var query = from s
                        in ta.Users_Linq
                        where s.user_name == user
                        select s;
            if (query.Count() == 1)
                Response.Write("该账号已经被注册");
            else
                Response.Write("恭喜！该账号可注册");
            Response.End();

        }
        public void register()
        {
            string user = Request.QueryString["register_user"];
            string password = Request.QueryString["register_password"];
            Users_Linq a = new Users_Linq();
            a.user_name = user;
            a.user_password = password;
            ta.Users_Linq.InsertOnSubmit(a);
            ta.SubmitChanges();
            Response.Write("注册成功！返回登录页面");
            Response.End();

        }

        //更改个人信息
        public void update_personal_information()
        {
            string email = Request.QueryString["email"];
            string qq = Request.QueryString["qq"];
            string wechat = Request.QueryString["wechat"];
            string birthday = Request.QueryString["birthday"];
            string sex = Request.QueryString["sex"];
            string hometown = Request.QueryString["hometown"];
            string introduce = Request.QueryString["introduce"];

            if (Session["username"] != null)
            {
                Users_Linq person = new Users_Linq();
                var query = from s in ta.Users_Linq where s.user_name == Session["username"].ToString() select s;
                person = query.FirstOrDefault();
                person.email = email;
                person.qq = qq;
                person.wechat = wechat;
                person.birthday = birthday;
                person.sex = sex;
                person.hometown = hometown;
                person.introduce = introduce;
                ta.SubmitChanges();
                Response.Write("保存成功！");
                Response.End();

            }


        }
        //传递个人信息
        public void personal_information()
        {

            if (Session["username"] != null)
            {
                Users_Linq person = new Users_Linq();
                var query = from s in ta.Users_Linq where s.user_name == Session["username"].ToString() select s;
                person = query.FirstOrDefault();
                string email = person.email;
                string qq = person.qq;
                string wechat = person.wechat;
                string birthday = person.birthday;
                string hometown = person.hometown;
                string sex = person.sex;
                string introduce = person.introduce;

                StringBuilder jsonBuilder = new StringBuilder();
                jsonBuilder.Append("{email:\"");
                jsonBuilder.Append(email);
                jsonBuilder.Append("\",qq:\"");
                jsonBuilder.Append(qq);
                jsonBuilder.Append("\",wechat:\"");
                jsonBuilder.Append(wechat);
                jsonBuilder.Append("\",birthday:\"");
                jsonBuilder.Append(birthday);
                jsonBuilder.Append("\",hometown:\"");
                jsonBuilder.Append(hometown);
                jsonBuilder.Append("\",sex:\"");
                jsonBuilder.Append(sex);
                jsonBuilder.Append("\",introduce:\"");
                jsonBuilder.Append(introduce);
                jsonBuilder.Append("\"}");

                Response.Write(jsonBuilder.ToString());
                Response.End();

            }
        }

        // 获取当前用户的用户名
        public void ResponseCurrentUser()
        {
            string username;
            if (Session["username"] == null)
                username = "";
            else
                username = Session["username"].ToString();

            Response.Write(username);
            Response.End();
        }

        // 注销
        public void Logout()
        {
            // 注销后移除session中的username
            Session.Remove("username");
            Response.Write("Success");
        }

        // 修改密码
        public void ModifyPwd(string oldPwd, string newPwd)
        {
            var query = from s
                        in ta.Users_Linq
                        where s.user_password == oldPwd
                        select s;
            if (query.Count() <= 0)
            {
                Response.Write("旧密码错误");
                Response.End();
                return;
            }

            var record = query.First();
            record.user_password = newPwd;
            try
            {
                ta.SubmitChanges();
            }
            catch(Exception)
            {
                Response.Write("修改失败");
                Response.End();
                return;
            }

            Response.Write("修改成功");
            Response.End();
        }
    }
}