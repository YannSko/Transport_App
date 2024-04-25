import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export function authHttpHeader() {
    const apiKey = process.env.API_KEY;
    const Base_url = "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia";

    const axiosInstance = axios.create({
        baseURL: Base_url,
        headers: {
        'apiKey': apiKey,
        },
    });
    return axiosInstance
}