﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models
{
    public partial class Tasks_f : MasterTasks
    {
        private DevisFacturationEntities db = new DevisFacturationEntities();
        public Tasks_f(MasterTasks t)
        {
            this.FK_Stories = t.FK_Stories;
            this.Description = t.Description;
            this.Initials = t.Initials;
            this.Duration = t.Duration;
            this.Fk_Ressource_Initials = t.Fk_Ressource_Initials;
        }
        public Tasks_f(string description, string initials, string duration, long fk_stories) : base(description, initials, duration, fk_stories)
        {
        }

        public Tasks_f()
        {

        }

        public void save()
        {
            Models.Tasks_f taskTemp = this;
            this.db.Tasks_f.Add(taskTemp);
            this.db.SaveChanges();
        }
    }
}