import { Grid, Spacer, Text } from "@nextui-org/react";
import { Box } from "./Box";
import { SampleCard } from "./SampleCard";

export const Login = () => {

    return (
        <Grid.Container>
            <Grid xs={12} sm={12} md={6}>
                <Box css={{
                    p: "$12",
                    "@xsMax": { pb: "$1" }
                }}>
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
                    <Text h3>
                        Once you log in you will be able to see your favourite tracks.
                        Then we will start analyzing the songs you love to give you suggestions and predictions.
                    </Text>
                </Box>
            </Grid>
            <Grid xs={12} sm={12} md={6} css={{ justifyContent: "center" }}>
                <Box css={{
                    p: "$12",
                    display: "flex",
                    justifyContent: "center",
                    "@smMax": { pb: "$10", pt: "$1" },
                    transform: "scale(0.8, 0.8) skewX(-20deg)",
                    transition: "all 300ms",
                    transitionTimingFunction: "ease-in-out",
                    "&:hover, &:active": {
                        transform: "scale(1, 1) skewX(0deg)",
                        cursor: "pointer"
                    }
                }}>
                    <SampleCard />
                </Box>
            </Grid>
        </ Grid.Container>
    )
};