namespace bgPrueba.Server.ActionModels
{
    public class ProductoMovimientoInterface
    {
        public int id_producto { get; set; }
        public int cantidad { get; set; }
        public string tipo { get; set; }
    }

    public class GetProductoMovimiento
    {
        public string tipo { get; set; }
        public int cantidad { get; set; }
        public string fecha { get; set; }
    }
}
