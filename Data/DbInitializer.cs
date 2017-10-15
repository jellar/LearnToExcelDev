using System.Linq;
using System.Threading.Tasks;
using LearnToExcelDev.Models;
using Microsoft.AspNetCore.Identity;

namespace LearnToExcelDev.Data
{
    public interface IDbInitializer
    {
        void Initialize();

    }
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _context;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<IdentityRole> _roleManager;



        public DbInitializer(

            ApplicationDbContext context,

            UserManager<ApplicationUser> userManager,

            RoleManager<IdentityRole> roleManager)

        {

            _context = context;

            _userManager = userManager;

            _roleManager = roleManager;

        }
        public async void Initialize()
        {
            // create database schema if none exists

                _context.Database.EnsureCreated();

            // seed roles and admin user
            var roles = new[] { "Administrator", "Parent", "Student" };
            foreach (var role in roles)
            {
                if (!_context.Roles.Any(r => r.Name == role))
                {
                    _context.Roles.Add(new IdentityRole(role));
                   //await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
            _context.SaveChanges();
            //await CreateAdminAccount(_context);

            await InitializeCourses(_context);
        }

        public async Task CreateAdminAccount(ApplicationDbContext context)
        {
            const string user = "admin@learntoexcel.co.uk";
            const string password = "Chang3m3.";

            await _userManager.CreateAsync(new ApplicationUser() { UserName = user, Email = user, EmailConfirmed = true },
                password);

            await _userManager.AddToRoleAsync(await _userManager.FindByNameAsync(user), "Administrator");
        }

        public async Task InitializeCourses(ApplicationDbContext context)
        {
            if (context.Courses.Any())
            {
                return;
            }
            var courses = new Course[]
            {
                new Course() {CourseId = 1, Title = "Maths Only", Credits = 15},
                new Course() {CourseId = 2, Title = "English Only", Credits = 15},
                new Course() {CourseId = 3, Title = "English with Maths & Science", Credits = 25}
            };

            foreach (Course couse in courses)
            {
                context.Courses.Add(couse);
            }
            await context.SaveChangesAsync();
        }
    }
}
