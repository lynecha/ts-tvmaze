import axios from "axios";
import * as $ from "jquery";

const $episodeBtn = $(".Show-getEpisodes");
const $showsList = $("#showsList");
const $episodeList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const APIURL: string = "https://api.tvmaze.com/";

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image?: string;
}

interface EpisodeInterface {
  id: number;
  name: string;
  season: number;
  number: number;
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const res = await axios.get(`${APIURL}/search/shows?q=${term}`);
  const jsonResponse = res.data;
  console.log("obj", jsonResponse[0].show);

  let showArr: [] = jsonResponse.map(
    (show: any) =>
      <ShowInterface>{
        id: show.show.id,
        name: show.show.name,
        summary: show.show.summary,
        image: show.show.image?.medium || "https://tinyurl.com/tv-missing",
      }
  );

  return showArr;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             ${show.summary}<div><small></small></div>
             <button id=${show.id} class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt: JQuery.SubmitEvent) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", $episodeBtn, async function (evt: JQuery.ClickEvent) {
  evt.preventDefault();
  console.log(evt.target.id);
  const episodes = await getEpisodesOfShow(evt.target.id);
  populateEpisodes(episodes);
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id: string) {
  const res = await axios.get(`${APIURL}shows/${id}/episodes`);
  console.log(res.data);
  return res.data;
}

/** Given list of episodes,
 *
 * empty episodeList and show episodesArea
 *
 * create markup for each and to DOM */
function populateEpisodes(episodes: EpisodeInterface[]) {
  $episodeList.empty();
  $episodesArea.show();
  for (let episode of episodes) {
    const $episode = $(
      `<li><div data-episode-id="${episode.id}" class="Show col-md-12 col-lg-6 mb-4">
         
      <p>${episode.name}</p>
      <p>Season: ${episode.season}</p>
      <p>Episode number: ${episode.number}</p>
      
           </div></li>
      `
    );

    $episodeList.append($episode);
  }
}
