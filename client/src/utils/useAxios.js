import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLogin } from '../state'
import dayjs from 'dayjs'

const baseURL = 'http://localhost:3001/'


const useAxios = () => {
    const accessToken = useSelector((state) => state.accessToken);
    const refreshToken = useSelector((state) => state.refreshToken);
    const expiresIn = useSelector((state) => state.expiresIn);
    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: accessToken }
    });


    axiosInstance.interceptors.request.use(async req => {

        const isExpired = dayjs.unix(expiresIn).diff(dayjs()) < 1;

        if (!isExpired) return req

        const response = await axios.post(`${baseURL}/auth/refresh/`, {
            token: refreshToken
        });

        dispatch(
            setLogin({
                user,
                expiresIn: response.data.tokens.expires_in,
                accessToken: response.data.tokens.access_token,
                refreshToken: response.data.tokens.refresh_token,
            })
        );

        req.headers.Authorization = response.data.tokens.access_token
        return req
    })

    return axiosInstance
}

export default useAxios;