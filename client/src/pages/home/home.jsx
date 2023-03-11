import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setAllTracks, setLogout, setRecommendations, setTracks } from "../../state";
import useAuth from "../../utils/useAuth";
import { Navbar, Button, Text, Spacer } from "@nextui-org/react";
import { Layout } from "../../components/Layout";
import { Logo } from "../../components/logos/Logo";
import { loginUrl } from "../../utils/Spotify";
import { Content } from "../../components/Content";
import { Login } from "../../components/Login";
import { refreshAccessToken } from "../../utils/refreshToken";
import { Linkedin } from "../../components/logos/Linkedin";
import { Github } from "../../components/logos/Github";

const code = new URLSearchParams(window.location.search).get('code')

const Dashboard = () => {
    useAuth(code);

    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.accessToken);
    const refreshToken = useSelector((state) => state.refreshToken);
    const tracks = useSelector((state) => state.tracks);
    const allTracks = useSelector((state) => state.allTracks);

    const getTopTracks = (controller) => {
        if (!accessToken) return;
        axios.post("http://localhost:3001/tracks/toptracks",
            { token: accessToken },
            { signal: controller.signal })
            .then((response) => {
                console.log(response);
                dispatch(
                    setTracks({
                        tracks: response.data.topTracksUpdated,
                    })
                );
            })
            .catch((error) => {
                if (error.response.status !== 401) return
                refreshAccessToken(refreshToken).then((token) => {
                    dispatch(
                        setAccessToken({
                            token
                        })
                    );
                    getTopTracks(controller);
                })
            })
    }

    const getAllTracks = (controller) => {
        if (!accessToken) return;
        axios.post("http://localhost:3001/tracks/alltracks",
            { token: accessToken },
            { signal: controller.signal })
            .then((response) => {
                dispatch(
                    setAllTracks({
                        allTracks: response.data.success,
                    })
                );
            }).catch((error) => {
                if (error.response.status !== 401) return
                refreshAccessToken(refreshToken).then((token) => {
                    dispatch(
                        setAccessToken({
                            token
                        })
                    );
                    getAllTracks(controller);
                })
            })
    }

    const getRecommendations = (trackIds) => {
        if (!accessToken) return;
        axios.post("http://localhost:3001/tracks/recommendations", { token: accessToken, trackIds })
            .then((response) => {
                dispatch(
                    setRecommendations({
                        recommendations: response.data.recommendationsUpdated,
                    })
                );
            })
            .catch((error) => {
                if (error.response.status !== 401) return
                refreshAccessToken(refreshToken).then((token) => {
                    console.log(token)
                    dispatch(
                        setAccessToken({
                            token
                        })
                    );
                    getRecommendations(trackIds);
                })

            })
    }

    const handleLogin = () => {
        window.location.href = loginUrl
    }

    const handleLogout = () => {
        axios.get("http://localhost:3001/auth/logout")
            .then(() => {
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
    }, [accessToken])

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
        getRecommendations(topTrackIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracks])

    return (
        <Layout>
            <Navbar shouldHideOnScroll variant="sticky">
                <Navbar.Brand>
                    <Navbar.Toggle showIn={"xs"} aria-label="toggle navigation" />
                    <Spacer x={1} />
                    <Logo />
                    <Text b color="inherit" >
                        SPOTIGENIE
                    </Text>
                </Navbar.Brand>
                <Navbar.Content >
                    <Navbar.Item hideIn={"xs"}>
                        <>
                            <Button
                                target="_blank"
                                icon={<Linkedin />}
                                light
                                as={"a"}
                                href="https://www.linkedin.com/in/marwan-ehab-48b0831ab"
                                auto />
                            <Button
                                target="_blank"
                                icon={<Github />}
                                light
                                as={"a"}
                                href="https://github.com/marwanehab98"
                                auto />
                        </>
                    </Navbar.Item>
                    <Navbar.Item hideIn={"xs"}>
                        {accessToken ?
                            <Button color="success" auto onPress={handleLogout}> Logout </Button> :
                            <Button color="success" auto onPress={handleLogin}> Login </Button>
                        }
                    </Navbar.Item>
                    <Navbar.Collapse>
                        <Navbar.CollapseItem>
                            <Button
                                target="_blank"
                                icon={<Linkedin />}
                                light
                                as={"a"}
                                href="https://www.linkedin.com/in/marwan-ehab-48b0831ab"
                                auto >LinkedIn
                            </Button>
                        </Navbar.CollapseItem>
                        <Navbar.CollapseItem>
                            <Button
                                target="_blank"
                                icon={<Github />}
                                light
                                as={"a"}
                                href="https://github.com/marwanehab98"
                                auto >Github</Button>
                        </Navbar.CollapseItem>
                        <Navbar.CollapseItem>
                            {accessToken ?
                                <Button light color="default" auto onPress={handleLogout}> Logout </Button> :
                                <Button light color="default" auto onPress={handleLogin}> Login </Button>
                            }
                        </Navbar.CollapseItem>
                    </Navbar.Collapse>
                </Navbar.Content>
            </Navbar>
            {accessToken ? <Content /> : <Login />}
        </Layout >
    )
}

export default Dashboard;