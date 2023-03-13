import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../state";

export default function useAuth(code) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.accessToken);

    const login = () => {
        if (!code || token) return;
        axios.post("http://localhost:3001/auth/login", { code })
            .then((response) => {
                dispatch(
                    setLogin({
                        user: response.data.user,
                        expiresIn: response.data.tokens.expires_in,
                        accessToken: response.data.tokens.access_token,
                        refreshToken: response.data.tokens.refresh_token,
                    })
                );
                navigate("/")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        login();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}