using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearnToExcelDev.Models
{
    public class Course
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Display(Name = "Number")]
        public int CourseId { get; set; }

        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        public int Credits { get; set; }
    }
}
