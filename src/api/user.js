import httpClient from "./httpClient";

export async function login(username, password) {
    const res = await httpClient.post("/user/login", { user: username, password });
    if (!res) throw new Error('Login failed');
    return res;
}

export async function getUser(id) {
    const res = await httpClient.get(`/user/${id}`);
    if (!res) throw new Error('Get users failed');
    console.log("user: ", res)
    return res;
}

export async function register(newUser) {
    const res = await httpClient.post("/user", newUser);
    return res;
}

export async function logout() {
    localStorage.removeItem('token');
}
