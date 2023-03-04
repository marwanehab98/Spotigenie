import { Text, Grid, Spacer, Collapse, Input, Progress } from "@nextui-org/react"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "./Box.js"
import { TrackCard } from "./TrackCard.js";
import { SearchButton } from "./SearchButton.js";
import { Search } from "./SearchIcon.js";

export const Content = () => {
	const token = useSelector((state) => state.accessToken);
	const allTracks = useSelector((state) => state.allTracks);
	const tracks = useSelector((state) => state.tracks);
	const recommendations = useSelector((state) => state.recommendations);
	const user = useSelector((state) => state.user);

	const searchQuery = useRef();
	const [displayMessage, setDisplayMessage] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const [similarity, setSimilarity] = useState(null);

	const getSimilarity = (controller) => {
		if (!token) return;
		axios.post("http://localhost:3001/tracks/similarity",
			{ selectedTrack: selectedTrack.id, token, allTracks },
			{ signal: controller.signal })
			.then((response) => {
				setSimilarity(response.data.results);
			}).catch((error) => {
				console.log(error);
			})
	}

	const searchTracks = (controller) => {
		if (!token) return;
		axios.post("http://localhost:3001/tracks/search",
			{ searchQuery: displayMessage, token },
			{ signal: controller.signal })
			.then((response) => {
				setSearchResults(response.data.results);
			}).catch((error) => {
				console.log(error);
			})
	}

	useEffect(() => {
		if (displayMessage === "") {
			setSearchResults([]);
			return;
		}
		const controller = new AbortController();

		searchTracks(controller);

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displayMessage]);


	useEffect(() => {
		if (!allTracks || !selectedTrack) return;

		setSimilarity(null);

		const controller = new AbortController();

		getSimilarity(controller)

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTrack, allTracks]);


	const handleSelection = (data) => {
		setSelectedTrack(data.track);
	};

	const handleSearch = (event, search = false) => {
		if (event.key === "Enter" || search) {
			setSelectedTrack(null);
			// setSimilarity(null);
			setDisplayMessage(searchQuery.current.value);
		}
	}

	return (
		<Box css={{ margin: "0.5rem", px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
			<Text
				css={{
					textGradient: "45deg, $blue600 -20%, $pink600 50%",
				}}
				h2>{`Hello, ${user?.display_name}! This is your SPOTIGENIE dashboard.`}</Text>
			<Collapse.Group shadow bordered>
				<Collapse title="SEARCH" subtitle="Search for a song and we'll tell you how much you'll like it.">
					<Box css={{
						display: "flex",
						justifyContent: "center"
					}}>
						<Input
							css={{ width: "95%" }}
							labelPlaceholder="Search"
							ref={searchQuery}
							onKeyDown={handleSearch}
							contentRightStyling={false}
							contentRight={
								<SearchButton onClick={(e) => handleSearch(e, true)}>
									<Search />
								</SearchButton>
							}

						/>
					</Box>
					<Grid.Container gap={4} justify="flex-start">
						{searchResults?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard track={track} isHoverable={true} isPressable={true} isSelected={handleSelection} />
								</Grid>
							);
						})}
						{selectedTrack && (
							<Box css={{
								display: "flex",
								flexDirection: "column",
								padding: "0px",
								alignItems: "start",
								justifyContent: "center",
								width: "100%"
							}}>
								<Progress
									indeterminated={!allTracks}
									value={similarity || 50}
									max={100}
									color="success"
									status="success"
								/>
								<Spacer y={1} />
								{similarity ?
									<Text h3>{
										similarity === 100 ?
											`The song ${selectedTrack.name} by ${selectedTrack.artists[0].name} is already in your library.` :
											`The song ${selectedTrack.name} by ${selectedTrack.artists[0].name} is ${similarity}% similar to your music.`
									}</Text> : <Text h3>Calculating similarity</Text>
								}
							</Box>
						)}
					</Grid.Container>
				</Collapse>
				<Collapse title="RECOMMENDATIONS" subtitle="A list of recommendations based on what you listen to.">
					<Grid.Container gap={4} justify="flex-start">
						{recommendations?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard track={track} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse>
				<Collapse title="TOP TRACKS" subtitle="Your favourite songs right now.">
					<Grid.Container gap={4} justify="flex-start">
						{tracks?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard track={track} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse>
			</Collapse.Group>
		</Box>
	)
};