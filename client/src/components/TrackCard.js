import { Card, Col, Row, Text } from "@nextui-org/react";

export const TrackCard = ({ track, isPressable = false, isHoverable = false, isSelected }) => {

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

    const name = track.name;
    const artistNames = appendArtists(track.artists);
    const image = track.album.images[0].url;

    return (
        <Card variant="flat" onPress={handlePress} isHoverable={isHoverable} isPressable={isPressable} css={{ w: "100%" }}>
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
                    borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                    bottom: 0,
                    zIndex: 1,
                }}
            >
                <Row>
                    <Col>
                        <Text color="#000" size={15}>
                            {name}
                        </Text>
                        <Text color="#000" size={15}>
                            {artistNames}
                        </Text>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};