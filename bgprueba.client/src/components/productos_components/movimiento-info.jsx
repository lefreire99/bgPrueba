import { CircleFill } from "react-bootstrap-icons";
import { formatStatesMovimiento } from "../../utils/functions"

export const renderers = {
    tipo: {
        label: "Tipo de Movimiento",
        render: (value) => {
            const { estado, color } = formatStatesMovimiento(value);
            return <span className={color}><CircleFill size={8} /> {estado}</span>;
        }
    },
    cantidad: {
        label: "Cantidad",
        render: (value) => <span>{value}</span>
    },
    fecha: {
        label: "Fecha",
        render: (value) => <span>{value}</span>
    }
}

export const headers = [
    {label: "Tipo de movimiento", key: "tipo"},
    {label: "Cantidad", key: "cantidad"},
    {label: "Fecha", key: "fecha"}
]