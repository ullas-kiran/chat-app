import {HOST} from '@/utils/constants'
import axios, { AxiosInstance } from 'axios';
export const apiClient:AxiosInstance=axios.create({
    baseURL:HOST,
})

