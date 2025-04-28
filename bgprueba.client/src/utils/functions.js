export const inputStyle = (errors) => {
    return {
        borderColor: errors ? 'red' : '#E6E9EC',
    }
}

export const selectStyle = (errors) => {
    return {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: errors ? 'red' : '#E6E9EC',
        }),
    }
}

export const capitalize = (word) => {
    const str = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return str;
}

export const handleChangePrecio = (e, setVal) => {
    const name = e.target.name;
    const val = e.target.value;
    const cleanedValue = val.replace(/[^\d.]/g, '');

    const dotCount = cleanedValue.split('.').length - 1;
    const formattedValue = dotCount > 1 ? cleanedValue.slice(0, -1) : cleanedValue;

    setVal(name, formattedValue);
}

export const handleChangeCantidad = (e, setVal) => {
    const name = e.target.name;
    const val = e.target.value;
    const cleanedValue = val.replace(/\D/g, '');
    const length = cleanedValue.length;

    if (length > 1 && cleanedValue[0] == 0) {
        setVal(name, cleanedValue.substring(1));
    } else if (length <= 1) {
        setVal(name, '0');
    } else {
        setVal(name, cleanedValue);
    }
}

export const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}

export const formatStates = (state) => {
    switch (state) {
        case "A":
            return { estado: "Activo", color: "text-success" };
        case "I":
            return { estado: "Inactivo", color: "text-danger" };
        default:
            return { estado: "NE", color: "text-danger" };
    }
}

export const formatStatesMovimiento = (state) => {
    switch (state) {
        case "E":
            return { estado: "Registro de entrada", color: "text-success" };
        case "S":
            return { estado: "Registro de salida", color: "text-danger" };
        case "I":
            return { estado: "Corrección de entrada", color: "text-warning" };
        case "O":
            return { estado: "Corrección de salida", color: "text-info" };
        case "A":
            return { estado: "Actualización del total", color: "text-primary" };
        default:
            return { estado: "NE", color: "text-danger" };
    }
}