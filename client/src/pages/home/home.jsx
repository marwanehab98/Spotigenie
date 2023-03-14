import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setLogout, setRecommendations,
    // setTheme,
    setTracks
} from "../../state";
import useAuth from "../../utils/useAuth";
import {
    Navbar, Button, Text, Spacer,
    // Switch
} from "@nextui-org/react";
import { Layout } from "../../components/Layout";
import { Logo } from "../../components/logos/Logo";
import { loginUrl } from "../../utils/Spotify";
import { Content } from "../../components/Content";
import { Login } from "../../components/Login";
import { Linkedin } from "../../components/logos/Linkedin";
import { Github } from "../../components/logos/Github";
import useAxios from '../../utils/useAxios.js'
// import { SunIcon } from "../../components/logos/SunIcon";
// import { MoonIcon } from "../../components/logos/MoonIcon";

const code = new URLSearchParams(window.location.search).get('code')

const Dashboard = () => {
    useAuth(code);

    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.accessToken);
    const tracks = useSelector((state) => state.tracks);
    // const darktheme = useSelector((state) => state.darktheme);

    let api = useAxios()

    const getTopTracks = async (controller) => {
        if (!accessToken) return;
        try {
            let response = await api.get('/tracks/toptracks',
                { signal: controller.signal });
            if (response.status === 200) {
                dispatch(
                    setTracks({
                        tracks: response.data.topTracksUpdated,
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getRecommendations = async (trackIds) => {
        if (!accessToken) return;
        try {
            let response = await api.post('/tracks/recommendations',
                { trackIds });
            if (response.status === 200) {
                dispatch(
                    setRecommendations({
                        recommendations: response.data.recommendationsUpdated,
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }
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
                console.log(error)
            })
    }

    // const switchTheme = () => dispatch(setTheme());

    useEffect(() => {
        const controller = new AbortController();

        if (tracks.length === 0) getTopTracks(controller);

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
            <Navbar shouldHideOnScroll variant="floating">
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
                    {/* <Navbar.Item hideIn={"xs"}>
                        <Switch
                            color="success"
                            initialChecked={!darktheme}
                            iconOn={<SunIcon filled />}
                            iconOff={<MoonIcon filled />}
                            onChange={switchTheme}
                        />
                    </Navbar.Item> */}
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
                        {/* <Navbar.CollapseItem>
                            <Button
                                onPress={switchTheme}
                                light
                                auto >Switch Theme</Button>
                        </Navbar.CollapseItem> */}
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