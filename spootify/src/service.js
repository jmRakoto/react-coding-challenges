import axios from "axios";
import Api from "./config";

const Axios = axios.create({
  baseURL: Api.api.baseUrl,
});

const login = async () => {
  try {
    const result = await axios.post(
      Api.api.authUrl,
      `grant_type=client_credentials&client_id=${Api.api.clientId}&client_secret=${Api.api.clientSecret}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(Api.api.clientId + ":" + Api.api.clientSecret).toString(
              "base64",
            ),
        },
      },
    );

    return result.data.access_token;
  } catch (e) {
    return;
  }
};

const newRealeases = async (accessToken) => {
  try {
    const result = await Axios.get("/new-releases", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result.data.albums.items;
  } catch (e) {
    return [];
  }
};

const featuredPlaylists = async (accessToken) => {
  try {
    const result = await Axios.get("/featured-playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result.data.playlists.items;
  } catch (e) {
    return [];
  }
};

const categories = async (accessToken) => {
  try {
    const result = await Axios.get("/categories", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result.data.categories.items;
  } catch (e) {
    return [];
  }
};

const getAllDatas = async () => {
  try {
    const access_token = await login();

    return await Promise.all([
      newRealeases(access_token),
      featuredPlaylists(access_token),
      categories(access_token),
    ]);
  } catch (e) {
    return [[], [], []];
  }
};

export { getAllDatas };
