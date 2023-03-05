import { Spacer, Text } from "@nextui-org/react";
import { Box } from "./Box";

export const Login = () => {

    return (
        <Box css={{ margin: "20px", px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
            <Text
                css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
                h1>Welcome to SPOTIGENIE.</Text>
            <Text
                css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                    width: "50%"
                }}
                h1>Explore new music, find your top songs, and get predictions.</Text>
            <Spacer y={1} />
            <Text h3 css={{ width: "30%" }}>
                Once you log in you will be able to see your favourite tracks.
                Then we will start analyzing your songs to give you suggestions and predictions on whether you'll like a song or not.
            </Text>
            {/* <Spacer y={1} /> */}
            <Text h4></Text>
        </Box>
    )
};