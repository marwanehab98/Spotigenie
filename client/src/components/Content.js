import { Text, Grid, Spacer, Collapse, Input, Progress } from "@nextui-org/react"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "./Box.js"
import { TrackCard } from "./TrackCard.js";
import { SearchButton } from "./SearchButton.js";
import { Search } from "./SearchIcon.js";
import { refreshAccessToken } from "../utils/refreshToken.js";
import { setAccessToken } from "../state/index.js";

const audio = new Audio();
audio.preload = "metadata";

export const Content = () => {
	const dispatch = useDispatch();

	const accessToken = useSelector((state) => state.accessToken);
	const refreshToken = useSelector((state) => state.refreshToken);
	const allTracks = useSelector((state) => state.allTracks);
	const tracks = useSelector((state) => state.tracks);
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

	const getSimilarity = (controller) => {
		if (!accessToken) return;
		axios.post("http://localhost:3001/tracks/similarity",
			{ selectedTrack: selectedTrack.id, token: accessToken, allTracks },
			{ signal: controller.signal })
			.then((response) => {
				setSimilarity(response.data.results);
			}).catch((error) => {
				console.log(error);
				refreshAccessToken(refreshToken).then((token) => {
					dispatch(
						setAccessToken({
							token
						})
					);
					getSimilarity(controller);
				})
			})
	}

	const searchTracks = (controller) => {
		if (!accessToken) return;
		axios.post("http://localhost:3001/tracks/search",
			{ searchQuery: displayMessage, token: accessToken },
			{ signal: controller.signal })
			.then((response) => {
				setSearchResults(response.data.resultsUpdated);
			}).catch((error) => {
				console.log(error);
				refreshAccessToken(refreshToken).then((token) => {
					dispatch(
						setAccessToken({
							token
						})
					);
					searchTracks(controller);
				})
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

	useEffect(() => {
		if (audio.paused || isNaN(audio.duration)) return;
		const timeout = setTimeout(() => {
			setPlaybackState({
				playing: false,
				duration: 0,
				currentTime: 0,
				src: ""
			});
		}, (audio.duration - audio.currentTime) * 1000);

		const interval = setInterval(() => {
			setPlaybackState(p => {
				return { ...p, currentTime: audio.currentTime }
			});
		}, 1000);

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		}
	}, [playbackState])

	audio.onloadedmetadata = () => {
		setPlaybackState({
			playing: !audio.paused,
			duration: audio.duration,
			currentTime: audio.currentTime,
			src: audio.src
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
		setPlaybackState({
			playing: !audio.paused,
			duration: audio.duration,
			currentTime: audio.currentTime,
			src: audio.src
		});
	};

	const handleSearch = (event, search = false) => {
		if (event.key === "Enter" || search) {
			setSelectedTrack(null);
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
							css={{ width: "100%" }}
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
										refreshToken={refreshToken}
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
				</Collapse>
				<Collapse title="RECOMMENDATIONS" subtitle="Get recommendations based on what you listen to.">
					<Grid.Container gap={4} justify="flex-start">
						{recommendations?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard
										accessToken={accessToken}
										refreshToken={refreshToken}
										track={track}
										isPlaying={handlePlayback}
										playbackState={playbackState} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse>
				<Collapse title="TOP TRACKS" subtitle="See the songs you listen to the most at the moment.">
					<Grid.Container gap={4} justify="flex-start">
						{tracks?.map((track) => {
							return (
								<Grid key={track.id} xs={12} sm={6} md={3}>
									<TrackCard
										accessToken={accessToken}
										refreshToken={refreshToken}
										track={track}
										topTrack={true}
										isPlaying={handlePlayback}
										playbackState={playbackState} />
								</Grid>
							);
						})}
					</Grid.Container>
				</Collapse>
			</Collapse.Group>
		</Box>
	)
};