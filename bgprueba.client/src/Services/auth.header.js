export function authHeader() {
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {}
    }
}