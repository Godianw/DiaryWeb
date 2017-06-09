using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace diary
{
    public partial class WebService : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.Form["diary_id"];

            string title = Request.Form["diary_title"];
            string content = Request.Form["diary_content"];   

            string pageSize = Request.Form["pageSize"];
            string currentPage = Request.Form["currentPage"];

            string del_id = Request.Form["del_diary_id"];

            if (Session["username"] == null || Session["username"].ToString() == "")
            {
                Response.Write("Error");
                Response.End();
                return ;
            }

            Response.Clear();

            // 只有id，加载日志标题和内容
            if (id != null && title == null)
            {
                loadDiary(Convert.ToInt32(id));
            }
            // 只有标题，发表日志
            else if (title != null && id == null)
            {
                submitDiary(title, content);
            }
            // 有id和标题，保存日志
            else if (id != null && title != null)
            {
                saveDiary(Convert.ToInt32(id), title, content);
            }

            // 删除日志
            if (del_id != null)
            {
                deleteDiary(Convert.ToInt32(del_id));
            }

            // 显示日志列表
            if (pageSize != null && currentPage != null)
            {
                showDiaryList(Convert.ToInt32(pageSize), Convert.ToInt32(currentPage));
            }
        }

        // 加载日志标题和内容
        public void loadDiary(int id)
        {
            DiaryEntities db = new DiaryEntities();

            var record = db.Diary.Where(p => p.diary_id == id).First();
            if (record != null)
            {
                string title = record.diary_title;
                string content = record.diary_content.Replace("\"", "'");
                string subtime = record.diary_subtime;

                StringBuilder jsonBuilder = new StringBuilder();
                jsonBuilder.Append("{title:\"");
                jsonBuilder.Append(title);
                jsonBuilder.Append("\",content:\"");
                jsonBuilder.Append(content);
                jsonBuilder.Append("\",subtime:\"");
                jsonBuilder.Append(subtime);
                jsonBuilder.Append("\"}");

                Response.ContentType = "text/plain";
                Response.Charset = "UTF-8";
                Response.Write(jsonBuilder.ToString());
                Response.End();
            }
            else
            {
                Response.Write("Error");
                Response.End();
            }
        }

        // 发表日志
        public void submitDiary(string title, string content)
        {
            string username = Session["username"].ToString();
            DiaryEntities db = new DiaryEntities();

            int user_id = db.Users.Where(p => p.user_name == username)
                .Select(s => s.user_id).First();
            Diary newDiaryRecord = new Diary()
            {
                diary_title = title,
                diary_content = content,
                diary_subtime = DateTime.Now.ToString("yyyy/MM/dd"),
                diary_author_id = user_id
            };
            db.Diary.Add(newDiaryRecord);

            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {
                Response.Write("Error");
                Response.End();
                return;
            }

            Response.Write("Success");
            Response.End();
        }

        // 保存日志
        public void saveDiary(int id, string title, string content)
        {
            DiaryEntities db = new DiaryEntities();

            var record = db.Diary.Where(p => p.diary_id == id).First();
            if (record != null)
            {
                record.diary_title = title;
                record.diary_content = content;

                try
                {
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    Response.Write("Error");
                    Response.End();
                    return;
                }

                Response.Write("Success");
                Response.End();
            }
        }

        // 删除日志
        public void deleteDiary(int id)
        {
            DiaryEntities db = new DiaryEntities();
            Diary delRecord = new Diary() { diary_id = id };
            db.Diary.Attach(delRecord);
            db.Diary.Remove(delRecord);
            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {
                Response.Write("Error");
                Response.End();
                return;
            }

            Response.Write("Success");
            Response.End();
        }

        // 显示日志
        public void showDiaryList(int pageSize, int currentPage)
        {
            int sectionLower = pageSize * (currentPage - 1) + 1;
            int sectionUpper = pageSize * currentPage;
            string username = Session["username"].ToString();

            SqlConnection conn = new SqlConnection("server=172.18.164.140;database=Diary;uid=test;pwd=000000");
            conn.Open();

            string sql = "SELECT * FROM (SELECT row_number() over (ORDER BY diary_subtime DESC)"
                + " rownumber, * FROM View_Diary WHERE user_name = @username) as tmpTb WHERE"
                + " rownumber > " + (sectionLower - 1) + " AND rownumber < " + (sectionUpper + 1);
            SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.Add(new SqlParameter("@username", username));

            SqlDataReader reader = cmd.ExecuteReader();
            string json = DataReader2Json(reader);

            Response.ContentType = "text/plain";
            Response.Charset = "UTF-8";
            Response.Write(json);
            Response.End();

            conn.Close();
        }

        // 数据
        protected int getRecordsCount()
        {
            DiaryEntities db = new DiaryEntities();
            string username = Session["username"].ToString();
            var records = db.View_Diary.Where(p => p.user_name == username).ToList();

            if (records?.Count() >= 0)
                return records.Count();

            return 0;
        }

        // 将数据转换为json字符串
        public string DataReader2Json(SqlDataReader reader)
        {
            StringBuilder jsonBuilder = new StringBuilder();

            int totalCount = getRecordsCount();
            jsonBuilder.Append("[");
            while (reader.Read())
            {
                jsonBuilder.Append("{\"totalCount\":\"");
                jsonBuilder.Append(totalCount);
                jsonBuilder.Append("\",");
                for (int i = 0; i < 5; ++i)
                {
                    if (i == 0)
                        continue;

                    jsonBuilder.Append("\"");
                    string[] colFieldName = { "", "diary_id", "diary_title", "diary_content",
                        "diary_subtime" };
                    jsonBuilder.Append(colFieldName[i]);
                    jsonBuilder.Append("\":\"");
                    jsonBuilder.Append(reader[i].ToString().Replace("\"", "'"));
                    jsonBuilder.Append("\",");
                }
                jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
                jsonBuilder.Append("},");
            }
            jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
            jsonBuilder.Append("]");

            return jsonBuilder.ToString();
        }
    }
}