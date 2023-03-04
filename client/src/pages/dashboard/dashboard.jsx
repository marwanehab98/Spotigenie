import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllTracks, setLogout, setRecommendations, setTracks } from "../../state";
import useAuth from "../../utils/useAuth";
import { Navbar, Button, Text } from "@nextui-org/react";
import { Layout } from "../../components/Layout";
import { Logo } from "../../components/Logo";
import { loginUrl } from "../../utils/Spotify";
import { Content } from "../../components/Content";
import { Login } from "../../components/Login";

const code = new URLSearchParams(window.location.search).get('code')

const Dashboard = () => {
    useAuth(code);

    const dispatch = useDispatch();

    const token = useSelector((state) => state.accessToken);
    const tracks = useSelector((state) => state.tracks);
    const allTracks = useSelector((state) => state.allTracks);

    const getTopTracks = (controller) => {
        if (!token) return;
        axios.post("http://localhost:3001/tracks/toptracks",
            { token },
            { signal: controller.signal })
            .then((response) => {
                console.log(response.data.topTracks)
                dispatch(
                    setTracks({
                        tracks: response.data.topTracks,
                    })
                );
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    const getAllTracks = (controller) => {
        if (!token) return;
        axios.post("http://localhost:3001/tracks/alltracks",
            { token },
            { signal: controller.signal })
            .then((response) => {
                dispatch(
                    setAllTracks({
                        allTracks: response.data.success,
                    })
                );
            }).catch((error) => {
                console.log(error);
            })
    }

    const getRecommendations = (trackIds) => {
        if (!token) return;
        axios.post("http://localhost:3001/tracks/recommendations", { token, trackIds })
            .then((response) => {
                dispatch(
                    setRecommendations({
                        recommendations: response.data.recommendations,
                    })
                );
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    const handleLogin = () => {
        window.location.href = loginUrl
    }

    const handleLogout = () => {
        axios.get("http://localhost:3001/auth/logout")
            .then((response) => {
                console.log(response);
                dispatch(
                    setLogout()
                );
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    useEffect(() => {
        const controller = new AbortController();

        if (tracks.length === 0) getTopTracks(controller);
        if (!allTracks) getAllTracks(controller);

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        if (tracks.length === 0) return;
        var indices = [];
        var topTrackIds = [];
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * 48);
            while (indices.includes(index)) {
                index = Math.floor(Math.random() * 48);
            }
            const track = tracks[index];
            topTrackIds.push(track.id);
        }
        // const topTrackIds = tracks.slice(0, 5).map((track) => track.id);
        getRecommendations(topTrackIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracks])

    return (
        <>

            <Layout>
                <Navbar variant="sticky">
                    <Navbar.Brand>
                        <Logo />
                        <Text b color="inherit" hideIn="xs">
                            SPOTIGENIE
                        </Text>
                    </Navbar.Brand>
                    <Navbar.Content>
                        <Navbar.Item>
                            {token ?
                                <Button color="success" auto onPress={handleLogout}> Logout </Button> :
                                <Button color="success" auto onPress={handleLogin}> Login </Button>
                            }
                        </Navbar.Item>
                    </Navbar.Content>
                </Navbar>
                {token ? <Content /> : <Login />}
            </Layout>
        </>
    )
}

export default Dashboard;