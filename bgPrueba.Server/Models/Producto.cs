namespace bgPrueba.Server.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public int Idcategoria { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int Stock { get; set; }
        public decimal Precio { get; set; }
        public string Estado { get; set; }
        public DateTime Fechacreacion { get; set; }
        public DateTime Ultimocambio { get; set; }
        public Categoria Categoria { get; set; }
        public List<ProductoMovimiento> Movimientos { get; set; } = new List<ProductoMovimiento>();
    }
}
