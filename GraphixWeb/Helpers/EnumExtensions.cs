using System.ComponentModel;
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

        public static T GetEnumValueFromDescription<T>(string description) where T : Enum
        {
            // Obtém todos os valores do enum
            var enumType = typeof(T);
            var fields = enumType.GetFields(BindingFlags.Public | BindingFlags.Static);

            // Itera sobre os campos do enum
            foreach (var field in fields)
            {
                // Obtém o valor do enum
                var value = (T)field.GetValue(null);

                // Obtém o atributo de descrição
                var attribute = field.GetCustomAttributes(typeof(DescriptionAttribute), false)
                                     .FirstOrDefault() as DescriptionAttribute;

                // Verifica se a descrição do atributo corresponde à string fornecida
                if (attribute != null && attribute.Description.Equals(description, StringComparison.OrdinalIgnoreCase))
                {
                    return value;
                }

                // Se não houver atributo de descrição, verifica se o nome do campo corresponde
                if (field.Name.Equals(description, StringComparison.OrdinalIgnoreCase))
                {
                    return value;
                }
            }

            // Se nenhum valor correspondente for encontrado, lança uma exceção
            throw new ArgumentException($"Nenhum valor correspondente encontrado para a descrição '{description}'.", nameof(description));
        }
    }
}