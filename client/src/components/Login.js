import { Button, Card, Col, Container, Grid, Loading, Progress, Row, Spacer, Text } from "@nextui-org/react";
import { Box } from "./Box";
import { HeartIcon } from "./logos/HeartIcon";
import { SampleCard } from "./SampleCard";

export const Login = () => {

    return (
        <Grid.Container>
            <Grid xs={12} sm={12} md={6}>
                <Box css={{ margin: "20px", px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
                    <Text
                        css={{
                            textGradient: "45deg, $blue600 -20%, $pink600 50%",
                        }}
                        h1>Welcome to SPOTIGENIE.</Text>
                    <Text
                        css={{
                            textGradient: "45deg, $blue600 -20%, $pink600 50%",
                        }}
                        h1>Explore new music, find your top songs, and get predictions.</Text>
                    <Spacer y={1} />
                    <Text h3 color="#d1d1d1">
                        Once you log in you will be able to see your favourite tracks.
                        Then we will start analyzing the songs you love to give you suggestions and predictions.
                    </Text>
                </Box>
            </Grid>
            <Grid xs={12} sm={12} md={6}>
                <Box css={{
                    "@xsMax": { py: "$10" },
                    transform: "scale(0.8, 0.8) translate(15%, 0%) skewX(-20deg)",
                    transition: "all 300ms",
                    "&:hover": {
                        transform: "scale(1, 1) translate(15%, 0%) skewX(0deg)",
                        cursor: "pointer"
                    }
                }}>
                    <SampleCard />
                </Box>
            </Grid>
        </ Grid.Container>
    )
};