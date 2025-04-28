namespace bgPrueba.Server.ActionModels
{
    public class ProductoInterface
    {
        public int id { get; set; }
        public int id_categoria { get; set; }
        public string nombre { get; set; }
        public string? descripcion { get; set; }
        public int stock { get; set; }
        public decimal precio { get; set; }
    }

    public class GetProducto
    {
        public int id { get; set; }
        public string? nombre { get; set; }
        public string? descripcion { get; set; }
        public int stock { get; set; }
        public decimal precio { get; set; }
        public int id_categoria { get; set; }
        public string categoria { get; set; }
        public string estado { get; set; }
    }
}
