using bgPrueba.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace bgPrueba.Server.DbContext
{
    public class ApplicationContext : IdentityDbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
        }

        public DbSet<ProductoMovimiento> ProductoMovimientos { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("dbo.Categoria");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Estado)
                    .HasDefaultValueSql("'A'")
                    .HasColumnType("character(1)");

                entity.Property(e => e.Fechacreacion)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Ultimocambio)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("dbo.Producto");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Descripcion)
                    .IsRequired(false)
                    .HasMaxLength(50);

                entity.Property(e => e.Precio)
                    .HasColumnType("decimal(10,2)");

                entity.Property(e => e.Stock);

                entity.Property(e => e.Estado)
                    .HasDefaultValueSql("'A'")
                    .HasColumnType("character(1)");

                entity.Property(e => e.Idcategoria);

                entity.Property(e => e.Fechacreacion)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Ultimocambio)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Categoria).WithMany(p => p.Productos)
                    .HasForeignKey(d => d.Idcategoria)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ProductoMovimiento>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("dbo.ProductoMovimiento");

                entity.Property(e => e.Cantidad);

                entity.Property(e => e.Tipo)
                    .HasDefaultValueSql("'E'")
                    .HasColumnType("character(1)");

                entity.Property(e => e.Estado)
                    .HasDefaultValueSql("'A'")
                    .HasColumnType("character(1)");

                entity.Property(e => e.Idproducto);

                entity.Property(e => e.Fechacreacion)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Ultimocambio)
                    .HasPrecision(3)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Producto).WithMany(p => p.Movimientos)
                    .HasForeignKey(d => d.Idproducto)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

        }

    }
}
