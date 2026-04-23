import { axiosAuth } from './api'

export const login = async (data) => {
    return await axiosAuth.post('/auth/login', data)
}

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get('/users')
    return { users: data }
}