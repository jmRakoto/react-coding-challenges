import React, { useState, useEffect } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import { getAllDatas } from "../../../service";

export default function Discover() {
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllDatas()
      .then((result) => {
        setNewReleases(result[0]);
        setPlaylists(result[1]);
        setCategories(result[2]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setNewReleases, setPlaylists, setCategories]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="discover">
      <DiscoverBlock
        text="RELEASED THIS WEEK"
        id="released"
        data={newReleases}
      />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
      <DiscoverBlock
        text="BROWSE"
        id="browse"
        data={categories}
        imagesKey="icons"
      />
    </div>
  );
}
