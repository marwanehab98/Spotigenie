import { Button, Card, Col, Loading, Progress, Row, Spacer, Text, Tooltip } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { HeartIcon } from "./logos/HeartIcon"
import AlbumArt from "./res/albumartplacholder.png"

let interval = null;

export const SampleCard = () => {

    const [playing, setPlaying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        if (playing) {
            interval = setInterval(() => setPercentage((p) => (p + 5)), 1500);
        }
        else setPercentage(0);

        return () => clearInterval(interval);
    }, [playing]);

    useEffect(() => {
        if (percentage === 100) {
            setPlaying(false);
        }
    }, [percentage]);

    return (
        <Card
            isPressable
            variant="shadow"
            css={{
                borderColor: "$neutralBorder",
                bw: "2px",
                w: "90%",
                borderStyle: "solid",
                aspectRatio: "1 / 1",
                "@smMax": {w: "70vw", aspectRatio: "4 / 3" }
            }}>
            <Card.Header css={{ justifyContent: "flex-end", position: "absolute", zIndex: 1, top: 5 }}>
                <Button.Group
                    auto
                    color="error"
                    css={{ bgBlur: "#0f111466" }}
                >
                    <Tooltip placement="bottomStart" content={"Press me to play/pause"}>
                        <Button
                            onPress={() => { setPlaying((p) => !p) }}
                            flat
                            animated
                            ripple={false}
                            css={{
                                w: "7rem",
                                jc: "flex-start",
                                color: "#d1d1d1",
                                bgColor: "transparent",
                                "&:disabled": {
                                    bgColor: "transparent",
                                    color: "#d1d1d1"
                                }
                            }}
                        >
                            <Text
                                css={{ color: "inherit" }}
                                size={12}
                                weight="bold"
                                transform="uppercase"
                            >
                                {playing ? "Pause" : "Play"}
                            </Text>
                            {playing &&
                                <>
                                    <Spacer x={0.5} />
                                    <Loading
                                        type="points-opacity"
                                        color={"currentColor"}
                                        size="sm" />
                                </>
                            }
                        </Button>
                    </Tooltip>
                    <Tooltip placement="bottomEnd" content={"Press me to add/remove song to your Spotify library."}>
                        <Button
                            onPress={() => { setIsSaved((s) => !s) }}
                            flat
                            ripple={false}
                            color="error"
                            icon={<HeartIcon fill="currentColor" filled={isSaved} />}
                            css={{
                                bgColor: "transparent",
                                "&:disabled": {
                                    bgColor: "transparent",
                                    color: "$error"
                                }
                            }}
                        >
                        </Button>
                    </Tooltip>
                </Button.Group>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Card.Image
                    src={AlbumArt}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    alt=""
                />
            </Card.Body>
            <Card.Footer
                isBlurred
                css={{
                    position: "absolute",
                    bgBlur: "#0f111466",
                    bottom: 0,
                    zIndex: 1,
                    height: "fit-content",
                    width: "100%"
                }}
            >
                <Progress
                    // indeterminated={playing}
                    color="success"
                    size="xs"
                    value={playing ? percentage : 0}
                    css={{
                        bc: "$gray800",
                        borderRadius: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "2px",
                    }}
                />
                <Row align="center">
                    <Col>
                        <Text color="#d1d1d1" size={12} weight="bold" css={{
                            overflow: "hidden",
                            textOverflow: "clip",
                            whiteSpace: "nowrap",
                            userSelect: "none"
                        }}>
                            The Genie Song
                        </Text>
                        <Text color="#d1d1d1" size={12} weight="bold" css={{
                            overflow: "hidden",
                            textOverflow: "clip",
                            whiteSpace: "nowrap",
                            userSelect: "none"
                        }}>
                            The Genie
                        </Text>
                        <Text color="#d1d1d1" size={12} weight="bold" css={{
                            overflow: "hidden",
                            textOverflow: "clip",
                            whiteSpace: "nowrap",
                            userSelect: "none"
                        }}>
                            Genie Vol.1
                        </Text>
                    </Col>
                </Row>
            </Card.Footer >
        </Card >
    )
} 