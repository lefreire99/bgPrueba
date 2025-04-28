namespace bgPrueba.Server.Models
{
    public class ProductoMovimiento
    {
        public int Id { get; set; }
        public int Idproducto { get; set; }
        public int Cantidad { get; set; }
        public string Tipo { get; set; }
        public string Estado { get; set; }
        public DateTime Fechacreacion { get; set; }
        public DateTime Ultimocambio { get; set; }
        public Producto Producto { get; set; }
    }
}
