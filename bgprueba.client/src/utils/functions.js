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

    const length = formattedValue.length;

    if (length > 1 && formattedValue[0] == 0 && formattedValue[1] == ".") {
        setVal(name, formattedValue);
    } else if (length > 1 && formattedValue[0] == 0) {
        setVal(name, formattedValue.substring(1));
    } else if (length <= 1) {
        setVal(name, '0');
    } else {
        setVal(name, formattedValue);
    }
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