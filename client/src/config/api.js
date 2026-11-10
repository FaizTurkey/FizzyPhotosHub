
import axios from 'axios'


export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json"
    }
})


// add token to request if exists

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;

})

// logout if token is expired

api.interceptors.request.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            const currentPath = window.location.pathname;
            if(currentPath !== "/login"){
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
)

