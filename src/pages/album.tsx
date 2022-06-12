import * as React from "react";
import { useParams, Link } from "react-router-dom";
import formatDuration from "format-duration";
import type { SubsonicAlbumResponse } from "../types";
import useSubsonic, { useURL } from "../fetcher";
import { GET_ALBUM } from "../const";
import { usePlayer } from "../components/player";

const Album = () => {
  const { id } = useParams();
  const [player, dispatch] = usePlayer();
  const { data: album } = useSubsonic<SubsonicAlbumResponse>(
    `${GET_ALBUM}?id=${id}`
  );
  const albumArt = useURL(`getCoverArt?id=${album?.coverArt}`);
  // const { data: albumInfo } = useSubsonic<SubsonicAlbumInfoResponse>(
  //   `${GET_ALBUM_INFO}?id=${id}`
  // );
  console.log(album);
  return (
    <>
      <h3>album {id}</h3>
      <h1>{album?.name}</h1>
      <h4>
        <Link to={`../artist/${album?.artistId}`}>{album?.artist}</Link>
      </h4>
      <img src={albumArt} />
      <ul>
        {album?.song.map((song) => (
          <li
            key={song.id}
            onClick={() => dispatch({ type: "play", payload: song })}
          >
            {song.title} - {formatDuration(song.duration * 1000)}{" "}
            {player.song?.id == song.id && `[${player.state}]`}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Album;
