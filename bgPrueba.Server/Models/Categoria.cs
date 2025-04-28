namespace bgPrueba.Server.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Estado { get; set; }
        public DateTime Fechacreacion { get; set; }
        public DateTime Ultimocambio { get; set; }
        public List<Producto> Productos { get; set; } = new List<Producto>();
    }
}
