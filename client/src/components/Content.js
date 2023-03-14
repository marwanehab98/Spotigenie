import { Text, Grid, Spacer, Collapse, Input, Progress } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "./Box.js"
import { TrackCard } from "./TrackCard.js";
import { SearchButton } from "./SearchButton.js";
import { Search } from "./logos/SearchIcon.js";
import useAxios from "../utils/useAxios.js";

const audio = new Audio();
audio.preload = "metadata";

export const Content = () => {

	let api = useAxios()

	const accessToken = useSelector((state) => state.accessToken);
	// const tracks = useSelector((state) => state.tracks);
	const recommendations = useSelector((state) => state.recommendations);
	const user = useSelector((state) => state.user);

	const searchQuery = useRef();
	const [displayMessage, setDisplayMessage] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const [similarity, setSimilarity] = useState(null);
	const [playbackState, setPlaybackState] = useState({
		playing: false,
		duration: 0,
		currentTime: 0,
		src: ""
	});

	const getSimilarity = async (controller) => {
		if (!accessToken) return;
		try {
			let response = await api.post('/tracks/similarity',
				{ selectedTrack: selectedTrack.id },
				{ signal: controller.signal });
			if (response.status === 200) {
				setSimilarity(response.data.results);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const searchTracks = async (controller) => {
		if (!accessToken) return;
		try {
			let response = await api.post('/tracks/search',
				{ searchQuery: displayMessage },
				{ signal: controller.signal });
			if (response.status === 200) {
				setSearchResults(response.data.resultsUpdated);
			}
		} catch (error) {
			console.log(error);
		}
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
		if (!selectedTrack) return;

		const controller = new AbortController();

		getSimilarity(controller)

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTrack]);


	const handleSelection = (data) => {
		setSelectedTrack(data.track);
	};

	audio.onloadedmetadata = () => {
		setPlaybackState({
			playing: !audio.paused,
			duration: audio.duration,
			currentTime: audio.currentTime,
			src: audio.src
		});
	}

	audio.ontimeupdate = () => {
		setPlaybackState(p => {
			var updatedPlayback = p;
			if (audio.currentTime - p.currentTime >= 0.5) {
				updatedPlayback = { ...p, currentTime: Math.round(audio.currentTime) };
			}
			return updatedPlayback;
		});
	}

	audio.onplay = () => {
		setPlaybackState(p => {
			return { ...p, playing: true };
		});
	}

	audio.onpause = () => {
		setPlaybackState(p => {
			return { ...p, playing: false };
		});
	}

	audio.onended = () => {
		setPlaybackState(p => {
			return { ...p, playing: false };
		});
	}

	const handlePlayback = ({ url }) => {
		if (!url) return;
		if (audio.src !== url) {
			audio.src = url;
			audio.load();
		}
		if (audio.paused) {
			audio.play();
		}
		else {
			audio.pause();
		}
	};

	const handleSearch = (event, search = false) => {
		if (event.key === "Enter" || search) {
			setSelectedTrack(null);
			setDisplayMessage(searchQuery.current.value);
		}
	}

	return (
		<Box css={{ pb: "$12", px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
			<Text
				css={{
					textGradient: "45deg, $blue600 -20%, $pink600 50%",
				}}
				h2>{`Hello, ${user?.display_name}! This is your SPOTIGENIE dashboard.`}</Text>
			<Collapse.Group shadow bordered>
				<Collapse title="SEARCH" subtitle="Search for a song and we'll predict you how much you'll like it.">
					<Box css={{
						p: "10px",
						display: "flex",
						justifyContent: "center"
					}}>
						<Input
							bordered
							color="success"
							css={{
								width: "100%",
							}}
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
									<TrackCard
										accessToken={accessToken}
										track={track}
										isHoverable={true}
										isPressable={true}
										isPlaying={handlePlayback}
										isSelected={handleSelection}
										playbackState={playbackState} />
								</Grid>
							);
						})}

					</Grid.Container>
					{selectedTrack && (
						<Box css={{
							display: "flex",
							flexDirection: "column",
							padding: "0px",
							alignItems: "start",
							justifyContent: "center",
							width: "100%",
						}}>
							<Progress
								size="sm"
								indeterminated={!similarity}
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
								}</Text> : <Text h3>Calculating similarity, first time might take a little longer depending on your connection.</Text>
							}
						</Box>
					)}
				</Collapse>
				<Collapse expanded title="RECOMMENDATIONS" subtitle="Get recommendations based on what you listen to.">
					<Grid.Container gap={4} justify="flex-start">
						{recommendations?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard
										accessToken={accessToken}
										track={track}
										isPlaying={handlePlayback}
										playbackState={playbackState} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse>
				{/* <Collapse title="TOP TRACKS" subtitle="See the songs you listen to the most at the moment.">
					<Grid.Container gap={4} justify="flex-start">
						{tracks?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard
										accessToken={accessToken}
										track={track}
										topTrack={true}
										isPlaying={handlePlayback}
										playbackState={playbackState} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse> */}
			</Collapse.Group>
		</Box>
	)
};