import { Spacer, Text } from "@nextui-org/react";
import { Box } from "./Box";

export const Login = () => {

    return (
        <Box css={{ margin: "20px", px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
            <Text
                css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
                h2>Welcome to SPOTIGENIE.</Text>
            <Spacer y={1} />
            <Text h4>Once you log in you will be able to see your favourite tracks.</Text>
            <Spacer y={1} />
            <Text h4>Then we will start analyzing your songs to give you suggestions and possibility of you liking new songs of your choosing.</Text>
        </Box>
    )
};