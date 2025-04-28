import { CircleFill } from "react-bootstrap-icons";
import { formatStates } from "../utils/functions"

export const renderers = {
    nombre: {
        label: "Nombre",
        render: (value) => <span>{value}</span>
    },
    precio: {
        label: "Precio",
        render: (value) => <span>${value}</span>
    },
    categoria: {
        label: "Categoría",
        render: (value) => <span>{value}</span>
    },
    estado: {
        label: "Estado",
        render: (value) => {
            const { estado, color } = formatStates(value);
            return <span className={color}><CircleFill size={8} /> {estado}</span>;
        }
    }
}

export const headers = [
    {label: "Nombre", key: "nombre"},
    {label: "Precio", key: "precio"},
    {label: "Categoría", key: "categoria"},
    {label: "Estado", key: "estado", width: "8%"}
]