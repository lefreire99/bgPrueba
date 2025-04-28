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
    status: {
        label: "Estado",
        render: (value) => <span>{value}</span>
    }
}

export const headers = [
    {label: "Nombre", key: "nombre"},
    {label: "Precio", key: "precio"},
    {label: "Categoría", key: "categoria"},
    {label: "Estado", key: "estado", width: "8%"}
]