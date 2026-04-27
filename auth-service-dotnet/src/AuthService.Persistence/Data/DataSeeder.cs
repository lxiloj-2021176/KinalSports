using AuthService.Domain.Entities;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Verificar si ya existen roles
        if (!(context.Roles?.Any() ?? false))
        {
            var roles = new List<Role>
            {
                new() {
                    Id = UuidGenerator.GenerateRoleId(),
                        Name = RoleConstants.ADMIN_ROLE
                },
                new() {
                    Id = UuidGenerator.GenerateRoleId(),
                        Name = RoleConstants.USER_ROLE
                }
            };

            await context.Roles!.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // Seed de un usuario administrador por defecto SOLO si no existen usuarios todavía
        if (!(await (context.Users?.AnyAsync() ?? Task.FromResult(false))))
        {
            // Buscar rol admin existente
            var adminRole = await (context.Roles ?? throw new InvalidOperationException("Roles DbSet is null.")).FirstOrDefaultAsync(r => r.Name == RoleConstants.ADMIN_ROLE);
            var userRole = await context.Roles
    .FirstOrDefaultAsync(r => r.Name == RoleConstants.USER_ROLE);

if (userRole == null)
    throw new InvalidOperationException("User role not found in database");
            if (adminRole != null)
            {
                var passwordHasher = new PasswordHashService();

                var userId = UuidGenerator.GenerateUserId();
                var profileId = UuidGenerator.GenerateUserId();
                var emailId = UuidGenerator.GenerateUserId();
                var userRoleId = UuidGenerator.GenerateUserId();

                var adminUser = new User
                {
                    Id = userId,
                    Name = "Admin",
                    Surname = "User",
                    Username = "admin",
                    Email = "admin@ksports.local",
                    Password = passwordHasher.HashPassword("Admin1234!"),
                    Status = true,
                    UserProfile = new UserProfile
                    {
                        Id = profileId,
                        UserId = userId,
                        ProfilePicture = string.Empty,
                        Phone = string.Empty
                    },
                    UserEmail = new UserEmail
                    {
                        Id = emailId,
                        UserId = userId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },
                    UserRoles =
                    [
                        new UserRole
                        {
                            Id = userRoleId,
                            UserId = userId,
                            RoleId = adminRole.Id
                        }
                    ]
                };

                await context.Users!.AddAsync(adminUser);
                
                // ==========================================
                // 2. CREACIÓN DEL USUARIO ESTÁNDAR
                // ==========================================
                var standardUserId = UuidGenerator.GenerateUserId();
                var standardProfileId = UuidGenerator.GenerateUserId();
                var standardEmailId = UuidGenerator.GenerateUserId();
                var standardUserRoleId = UuidGenerator.GenerateUserId();

                var standardUser = new User
                {
                    Id = standardUserId,
                    Name = "Standard",
                    Surname = "User",
                    Username = "user",
                    Email = "user@local.com",
                    Password = passwordHasher.HashPassword("Usuario2026!"), // Contraseña por defecto
                    Status = true, // Para que no necesite correo de activación

                    UserProfile = new UserProfile
                    {
                        Id = standardProfileId,
                        UserId = standardUserId,
                        ProfilePicture = string.Empty,
                        Phone = "11111111"
                    },

                    UserEmail = new UserEmail
                    {
                        Id = standardEmailId,
                        UserId = standardUserId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },

                    UserRoles = new List<UserRole>
                    {
                        new UserRole
                        {
                            Id = standardUserRoleId,
                            UserId = standardUserId,
                            RoleId = userRole.Id // Rol de Usuario Normal
                        }
                    }
                };

                await context.Users.AddAsync(standardUser);

                
                
                
                await context.SaveChangesAsync();
            }
        }
    }
}
