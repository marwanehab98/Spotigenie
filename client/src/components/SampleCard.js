import { Button, Card, Col, Loading, Progress, Row, Spacer, Text } from "@nextui-org/react"
import { HeartIcon } from "./logos/HeartIcon"
import AlbumArt from "./res/albumartplacholder.png"

export const SampleCard = () => {
    return (
        <Card
            variant="shadow"
            css={{ borderColor: "$neutralBorder", bw: "2px", borderStyle: "solid", w: "70%", aspectRatio: "1 / 1" }}>
            <Card.Header css={{ justifyContent: "flex-end", position: "absolute", zIndex: 1, top: 5 }}>
                <Button.Group
                    disabled
                    auto
                    color="error"
                    css={{ bgBlur: "#0f111466" }}
                >
                    <Button
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
                            Play
                        </Text>
                        <Spacer x={0.5} />
                        <Loading
                            type="points-opacity"
                            color={"currentColor"}
                            size="sm" />
                    </Button>
                    <Button
                        flat
                        ripple={false}
                        color="error"
                        icon={<HeartIcon fill="currentColor" filled={true} />}
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
                    indeterminated
                    color="success"
                    size="xs"
                    value={100}
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