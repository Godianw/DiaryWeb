﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace diary
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class DiaryEntities : DbContext
    {
        public DiaryEntities()
            : base("name=DiaryEntities")
        {
            this.Database.Connection.ConnectionString += ";password=000000";
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<View_Diary> View_Diary { get; set; }
        public virtual DbSet<Diary> Diary { get; set; }
        public virtual DbSet<Users> Users { get; set; }
    }
}
