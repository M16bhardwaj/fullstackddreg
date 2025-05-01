import axios, {AxiosError, AxiosInstance} from 'axios'

export const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        'Content-Type': 'application/json'
    }
})

http.interceptors.request.use((config)=>{
    const store = JSON.parse(localStorage.getItem('user') ?? '{}')
    console.log('store', store.token)
    if (store && store.token) {
        config.headers['Authorization'] = `Bearer ${store.token}`
    }
    return config
},(err: AxiosError)=>{
    if (err.response?.status === 401) {
        localStorage.removeItem('user')
        window.location.href = '/?login'
    }
    return Promise.reject(err)
})