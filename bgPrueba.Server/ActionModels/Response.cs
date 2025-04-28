namespace bgPrueba.Server.ActionModels
{
    public class Response
    {
        public string? Status { get; set; }
        public string? Message { get; set; }

        public Response() { }

        public void SetDataError()
        {
            this.Status = "Error";
            this.Message = "Datos no existen.";
        }

        public void SetServerError()
        {
            this.Status = "Error";
            this.Message = "Error en el servidor.";
        }

        public void SetSaveError()
        {
            this.Status = "Error";
            this.Message = "No es posible guardar los datos por el momento.";
        }

        public void setSuccess(string message)
        {
            this.Status = "Success";
            this.Message = message;
        }

        public void setError(string message)
        {
            this.Status = "Error";
            this.Message = message;
        }
    }

    public class AuthResponse
    {
        public string? Status { get; set; }
        public string? Message { get; set; }
        public object? usuario { get; set; }

        public AuthResponse() { }

        public void setSuccess(string message, object usuario)
        {
            this.Status = "Success";
            this.Message = message;
            this.usuario = usuario;
        }

        public void setError(string message)
        {
            this.Status = "Error";
            this.Message = message;
            this.usuario = null;
        }
    }

    public class ObjectResponse
    {
        public string? Status { get; set; }
        public string? Message { get; set; }
        public object? objeto { get; set; }

        public ObjectResponse() { }

        public void setSuccess(string message, object objeto)
        {
            this.Status = "Success";
            this.Message = message;
            this.objeto = objeto;
        }

        public void setError(string message)
        {
            this.Status = "Error";
            this.Message = message;
            this.objeto = null;
        }

        public void setObjectResponse(string tipo, string message, object objeto)
        {
            this.Status = tipo == "S" ? "Success" : "Error";
            this.Message = message;
            this.objeto = objeto;
        }
    }
}
