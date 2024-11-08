﻿using System.ComponentModel;
using System.Reflection;

namespace GraphixWeb.Helpers
{
    public static class EnumExtensions
    {
        public static string GetEnumDescription(this Enum value)
        {
            FieldInfo field = value.GetType().GetField(value.ToString());
            DescriptionAttribute attribute = (DescriptionAttribute)field.GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault();
            return attribute == null ? value.ToString() : attribute.Description;
        }
    }
}
