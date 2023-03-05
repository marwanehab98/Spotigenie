import { Button, Card, Col, Loading, Progress, Row, Spacer, Text } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../state";
import { refreshAccessToken } from "../utils/refreshToken";
import { HeartIcon } from "./logos/HeartIcon";


export const TrackCard = ({
    accessToken,
    refreshToken,
    track,
    topTrack = false,
    isPressable = false,
    isHoverable = false,
    isSelected,
    isPlaying,
    playbackState }) => {

    const dispatch = useDispatch();

    const playing = playbackState.playing && playbackState.src === track.preview_url;
    const percentage = playbackState.currentTime / playbackState.duration;
    const [isSaved, setIsSaved] = useState(track.is_saved);

    const appendArtists = (artists) => {
        let artistNames = "";
        artists.forEach((artist, index) => {
            artistNames = artistNames + `${artist.name}${index !== artists.length - 1 ? ", " : ""}`
        });
        return artistNames;
    }

    const handlePress = () => {
        isSelected({ track });
    }

    const handlePlay = () => {
        isPlaying({ url: track.preview_url });
    }

    const handleLikes = () => {
        if (isSaved) removeFromLikes();
        else addToLikes();
    }

    const addToLikes = () => {
        if (!accessToken) return;
        axios.post("http://localhost:3001/tracks/like",
            { track: [track.id], token: accessToken })
            .then((response) => {
                console.log(response)
                setIsSaved(true);
            }).catch((error) => {
                console.log(error)
                if (error.status !== 401) return
                refreshAccessToken(refreshToken).then((token) => {
                    dispatch(
                        setAccessToken({
                            token
                        })
                    );
                    addToLikes();
                })
            })
    }

    const removeFromLikes = () => {
        if (!accessToken) return;
        axios.post("http://localhost:3001/tracks/unlike",
            { track: [track.id], token: accessToken })
            .then((response) => {
                console.log(response)
                setIsSaved(false);
            }).catch((error) => {
                console.log(error)
                if (error.status !== 401) return
                refreshAccessToken(refreshToken).then((token) => {
                    dispatch(
                        setAccessToken({
                            token
                        })
                    );
                    removeFromLikes();
                })
            })
    }

    const name = track.name;
    const artistNames = appendArtists(track.artists);
    const image = track.album.images[0].url;

    return (
        <Card variant="shadow" onPress={handlePress} isHoverable={isHoverable} isPressable={isPressable} css={{ w: "100%" }}>
            <Card.Header css={{ justifyContent: "flex-end", position: "absolute", zIndex: 1, top: 5 }}>
                <Button.Group
                    auto
                    color="error"
                    css={{ bgBlur: "#ffffff66" }}
                >
                    <Button
                        flat
                        ripple={false}
                        onPress={handlePlay}
                        disabled={!track.preview_url}
                        css={{
                            color: "#000",
                            bgColor: "transparent",
                            "&:disabled": {
                                bgColor: "transparent"
                            }
                        }}
                    >
                        <Text
                            css={{ color: "inherit" }}
                            size={12}
                            weight="bold"
                            transform="uppercase"
                        >
                            {!track.preview_url ? "No preview" : playing ? "Pause" : "Play"}
                        </Text>
                        {playing &&
                            <>
                                <Spacer x={0.5} />
                                <Loading type="points" color={"currentColor"} size="sm" />
                            </>
                        }
                    </Button>
                    <Button
                        flat
                        ripple={false}
                        disabled={topTrack}
                        color="error"
                        icon={<HeartIcon fill="currentColor" filled={isSaved} />}
                        onPress={() => handleLikes()}
                        css={{
                            bgColor: "transparent",
                            "&:disabled": {
                                bgColor: "transparent",
                                color: "$error"
                            }
                        }}
                    >
                    </Button>
                </Button.Group>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Card.Image
                    src={image}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    alt="Card example background"
                />
            </Card.Body>
            <Card.Footer
                isBlurred
                css={{
                    position: "absolute",
                    bgBlur: "#ffffff66",
                    bottom: 0,
                    zIndex: 1,
                    height: "25%",
                }}
            >
                {playbackState.src === track.preview_url &&
                    <Progress
                        color="success"
                        size="xs"
                        value={percentage * 100}
                        css={{
                            borderRadius: 0,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "2px"
                        }}
                    />}
                <Row align="center">
                    <Col>
                        <Text color="#000" size={12} weight="bold">
                            {name}
                        </Text>
                        <Text color="#000" size={12} weight="bold">
                            {artistNames}
                        </Text>
                    </Col>
                </Row>
            </Card.Footer >
        </Card >
    );
};