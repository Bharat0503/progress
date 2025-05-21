import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Video } from 'expo-av';
import config from '../utils/config'
import { useDispatch, useSelector } from 'react-redux'
import Hls from 'hls.js'; // npm install hls.js
import { useFocusEffect } from '@react-navigation/native';
import { setVideoSegments } from '../redux/action';
import Analytics from '../services/Analytics';
import ContentType from '../utils/contentTypeIds';

interface SpaceSubHeaderProps {
    data: any,
    contentTypeId?: number,
    spaceContentId?: number
}

const VideoPlayer: React.FC<SpaceSubHeaderProps> = ({ data, contentTypeId, spaceContentId }) => {
    const dimension = useSelector((state: any) => state.reducer.dimentions)
    const videoTime = useSelector((state: any) => state.reducer.videoTime)
    const videoSegments = useSelector((state: any) => state.reducer.videoSegments)

    const [isBuffering, setBuffering] = useState<boolean>(true)
    const [mediaLength, setMediaLength] = useState<number>(0)
    const [videoLoaded, setVideoLoaded] = useState(false)

    let video = React.useRef<Video>(null);
    let videoWebRef = React.useRef<HTMLVideoElement>(null);
    let hlsInstanceRef = useRef<any>(null);


    let startTime = 0
    let stopTime = 0
    let initialstart = true
    let previousTime = 0
    let currentTime = 0
    let segmentAdded = false

    const dispatch = useDispatch()



    useFocusEffect(
        React.useCallback(() => {
            // Play video when the screen is focused
            if (video.current) {
                video.current.playAsync();
            }

            return () => {
                // Pause video when the screen loses focus
                if (video.current) {
                    video.current.pauseAsync();
                }

                // Web-specific cleanup
                if (config.isWeb && videoWebRef.current) {
                    videoWebRef.current.pause();
                }
            };
        }, [])
    );

    // URL type detection
    const getUrlType = (url: string) => {
        if (!url) return 'unknown';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('.m3u8')) return 'hls';
        if (lowerUrl.includes('.mp4')) return 'mp4';
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
        if (lowerUrl.includes('vimeo.com')) return 'vimeo';
        return 'standard';
    }

    const getFontSize = (size: number) => {
        if (config.isWeb) {
            const webSize = 0.20 * size
            return dimension.width * (webSize / 100)
        }
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        if (config.isWeb) {
            const webWidth = 0.4 * width
            return dimension.width * (webWidth / 100)
        }
        return dimension.width * (width / 100)
    }

    const getViewWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getViewHeight = (height: number) => {
        return dimension.height * (height / 100)
    }

    const getHeight = (height: number) => {
        if (config.isWeb) {
            const webHeight = 0.4 * height
            return dimension.width * (webHeight / 100)
        }
        return dimension.height * (height / 100)
    }

    const getTotalDuration = () => {
        let totalDuration = 0
        for (let key in videoSegments) {
            totalDuration = totalDuration + videoSegments[key].end - videoSegments[key].start
        }
        return totalDuration
    }


    useEffect(() => {
        return (() => {
            Analytics.logPlayEvent(
                contentTypeId === ContentType.VIDEOS
                    ? "video" : "podcast",
                spaceContentId,
                mediaLength,
                getTotalDuration(),
                videoSegments
            )
            dispatch(setVideoSegments([]))
        })
    }, [])

    // Web-specific URL handling
    useEffect(() => {
        const urlToPlay = data?.url || data?.file
        if (config.isWeb && videoWebRef.current && urlToPlay) {
            // Cleanup previous HLS instance
            if (hlsInstanceRef.current) {
                hlsInstanceRef.current.destroy();
                hlsInstanceRef.current = null;
            }

            const urlType = getUrlType(data?.url || data?.file);
            const videoElement = videoWebRef.current;

            // Reset previous source
            videoElement.src = '';

            const playVideo = () => {
                videoElement.play().catch(error => {
                    console.error('Error playing video:', error);
                    setBuffering(false);
                });
            };

            switch (urlType) {
                case 'hls':
                    // HLS handling with hls.js
                    if (Hls.isSupported()) {
                        const hls = new Hls({
                            debug: true, // Enable debug logging
                        });
                        hlsInstanceRef.current = hls;

                        hls.loadSource(data?.url || data?.file);
                        hls.attachMedia(videoElement);

                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            playVideo();
                        });

                        hls.on(Hls.Events.ERROR, (event, data) => {
                            console.error('HLS Error:', data);
                            // Fallback to direct source if HLS fails
                            if (data?.fatal) {
                                videoElement.src = data?.url || data?.file;
                                playVideo();
                            }
                        });
                    }
                    // Fallback for browsers with native HLS support
                    else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                        videoElement.src = data?.url || data?.file;
                        videoElement.addEventListener('loadedmetadata', playVideo);
                    }
                    break;

                default:
                    // Standard video sources including MP4, YouTube, etc.
                    videoElement.src = data?.url || data?.file;
                    videoElement.addEventListener('loadedmetadata', playVideo);
            }

            // General error handling
            videoElement.addEventListener('error', (e) => {
                console.error('Video element error:', e);
                setBuffering(false);
            });

            // Loading state management
            videoElement.addEventListener('waiting', () => setBuffering(true));
            videoElement.addEventListener('canplay', () => setBuffering(false));
        }

        // Cleanup function
        return () => {
            if (config.isWeb && videoWebRef.current) {
                if (hlsInstanceRef.current) {
                    hlsInstanceRef.current.destroy();
                    hlsInstanceRef.current = null;
                }
                videoWebRef.current.pause();
                videoWebRef.current.src = '';
            }
        };
    }, [data?.url || data?.file]);

    // Seeking functionality for native video
    useEffect(() => {
        const init = async () => {
            if (video.current && videoTime) {
                const millis = parseFloat(videoTime) * 1000;
                try {
                    await video?.current?.setPositionAsync(millis);
                    await video.current.playAsync();
                    console.log(`Seeked to: ${millis}ms`);
                } catch (error) {
                    console.error('Error seeking the video:', error);
                }
            }
        }

        init()
    }, [videoTime])

    const addVideoSegment = () => {

        if (startTime < stopTime) {
            let videoSegment = videoSegments
            let videosegment = {
                start: startTime,
                end: stopTime,
                datetime: new Date()
            }
            videoSegment.push(videosegment)
            dispatch(setVideoSegments(videoSegment))
            segmentAdded = true
        }

    }

    // Handle buffering and loading for native video
    const handlePlaybackStatusUpdate = async (status: any) => {


        if (status?.isLoaded) {
            if (!status?.isBuffering) {
                if (status?.isPlaying) {

                    if (initialstart) {

                        startTime = status?.positionMillis
                        initialstart = false
                        segmentAdded = false
                    }

                    if (status?.positionMillis < previousTime) {
                        stopTime = previousTime
                        initialstart = true
                        if (!segmentAdded) {
                            addVideoSegment()
                        }



                    }

                    if (status?.positionMillis > previousTime + 10000) {
                        stopTime = previousTime
                        initialstart = true
                        if (!segmentAdded) {
                            addVideoSegment()
                        }
                    }

                    previousTime = status?.positionMillis


                }
                else if (!status?.isPlaying) {
                    stopTime = status?.positionMillis
                    initialstart = true
                    if (!segmentAdded) {
                        addVideoSegment()
                    }
                }
            }
        }


        if (status?.isLoaded) {
            if (status?.isBuffering) {

                setMediaLength(status.durationMillis)
                if (status?.playableDurationMillis > status?.positionMillis + 2500) {
                    await video?.current?.playAsync();
                    setBuffering(false)
                } else {
                    setBuffering(true)
                }
            } else {
                setBuffering(false)
            }
        } else {
            console.error("Video loading error:", status.error);
        }
    };

    // Web video rendering
    if (config.isWeb) {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: getViewWidth(55),
                height: getViewHeight(50),
                flexDirection: 'row',
                marginVertical: getHeight(2),
                borderRadius: getWidth(3.5),
                position: 'relative'
            }}>
                <video
                    ref={videoWebRef}
                    controls
                    preload="auto"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: getWidth(3.5)
                    }}
                />
                {isBuffering && (
                    <View style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: [{ translateX: -25 }, { translateY: -25 }]
                    }}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>
        );
    }

    // Native mobile video rendering
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: getWidth(90),
            height: getHeight(23),
            flexDirection: 'row',
            marginVertical: getHeight(2),
            borderRadius: getWidth(3.5),
            position: 'relative'
        }}>
            <Video
                ref={video}
                source={{ uri: data?.url || data?.file }}
                style={{
                    width: getWidth(90),
                    height: getHeight(23),
                    borderRadius: getWidth(3.5),
                }}
                useNativeControls
                resizeMode='cover'
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                onLoad={() => setVideoLoaded(true)}
            />
            {isBuffering && (
                <View style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{ translateX: -25 }, { translateY: -25 }]
                }}>
                    <ActivityIndicator />
                </View>
            )}
        </View>
    );
}

export default VideoPlayer