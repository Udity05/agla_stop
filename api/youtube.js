export default async function handler(request, response) {
  try {
    const playlistId = request.query.playlistId;

    if (!playlistId) {
      return response.status(400).json({
        error: "Missing playlistId",
      });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return response.status(500).json({
        error: "YouTube API key is not configured.",
      });
    }

    const url =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      "?part=snippet,contentDetails" +
      "&maxResults=50" +
      "&playlistId=" +
      encodeURIComponent(playlistId) +
      "&key=" +
      encodeURIComponent(apiKey);

    const youtubeResponse = await fetch(url);

    const data = await youtubeResponse.json();

    if (!youtubeResponse.ok) {
      return response.status(youtubeResponse.status).json({
        error:
          data.error?.message ||
          "YouTube API error",
      });
    }

    const tracks = data.items
      .filter(
        (item) =>
          item.snippet?.resourceId?.videoId &&
          item.snippet?.title
      )
      .map((item) => ({
        id: item.snippet.resourceId.videoId,

        title: item.snippet.title,

        artist:
          item.snippet.videoOwnerChannelTitle ||
          "YouTube",

        thumbnail:
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",

        position: item.snippet.position,

        url:
          "https://www.youtube.com/watch?v=" +
          item.snippet.resourceId.videoId,
      }));

    return response.status(200).json({
      tracks,
    });

  } catch (error) {

    console.error(error);

    return response.status(500).json({
      error: "Server error while fetching playlist.",
    });
  }
}