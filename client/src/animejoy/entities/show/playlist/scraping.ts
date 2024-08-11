import { PlaylistEpisode, PlaylistGroup, PlaylistPlayer, PlaylistStudio, Playlists } from "./model";

export const AVAILABLE_PLAYERS = [
    "Sibnet",
    "OK",
    "VK",
    "AllVideo",
    "Dzen",
    "Mail",
    "Kodik",
    "Alloha",
    "CDA",
    "Наш плеер",
    "Ramble",
] as const;

const EPISODE_SET_PATTERN = /^(?<from>\d+)(?:\+|-)(?<to>\d+)?/i;

export function getPlaylistsData(playlistsHTML: Element): Playlists {

    const episodesHTML = Array.from(playlistsHTML.querySelectorAll(".playlists-player .playlists-videos .playlists-items ul li"));

    const groupsHTML = Array.from(playlistsHTML.querySelectorAll(".playlists-player .playlists-lists .playlists-items"));
    const groups = groupsHTML.map<PlaylistGroup>(l => Array.from(l.querySelectorAll("ul li")).map(li => ({
        id: li.getAttribute("data-id")!,
        label: li.textContent!,
    })));

    const playersList = groups.find(g => g.some(li => AVAILABLE_PLAYERS.some(p => p === li.label)));
    const setsList = groups.find(g => g.some(li => li.label.match(EPISODE_SET_PATTERN)));
    const studiosList = groups.find(g => g !== playersList && g !== setsList);

    const studios = getStudiosArray(studiosList);
    const players = getPlayersArray(playersList, studios);


    let lastId: string;
    let index = 0;
    const episodes: PlaylistEpisode[] = episodesHTML.map((f) => {
        const id = f.getAttribute("data-id")!;

        if (id !== lastId) index = 0;
        lastId = id;

        return ({
            id,
            index: index++,
            src: f.getAttribute("data-file")!,
            label: f.textContent!,
            player: players?.find(l => matchIDs(id, l.id)),
        });
    });

    return ({
        studios,
        players,
        episodes: fixEpisodesSort(episodes, setsList),
    });
}

function matchIDs(childID: string, parentID: string) {
    return childID.startsWith(parentID + "_") || childID === parentID;
}

const studioLabelRegexp = /^(?<label>.*?)(?: (?<count>\d+))?$/;
function getStudiosArray(studiosList: PlaylistGroup | undefined): PlaylistStudio[] | undefined {
    return studiosList?.map((s) => {

        const { label/* , count */ } = (s.label.match(studioLabelRegexp)?.groups ?? {}) as { label: string; count: string; };

        return {
            id: s.id,
            label: label,
        };
    });
}

function getPlayersArray(playersList: PlaylistGroup | undefined, studios: PlaylistStudio[] | undefined): PlaylistPlayer[] | undefined {
    if (!playersList) return undefined;

    const players = new Array<PlaylistPlayer>();
    playersList.forEach((p) => {
        const item = ({
            id: p.id,
            label: p.label.replace("Наш плеер", "Animejoy"),
            studio: studios?.find(s => matchIDs(p.id, s.id)),
        });
        if (!players.some(i => i.studio === item.studio && i.label === item.label)) {
            players.push(item);
        }
    });
    return players;
}

function fixEpisodesSort(episodes?: PlaylistEpisode[], sets?: PlaylistGroup) {
    if (!episodes) return undefined;
    if (!sets) return episodes;

    const setIdPos = sets[0]!.id.split("_").length - 1;

    const [from1] = sets[0]!.label.match(EPISODE_SET_PATTERN) ?? [];
    const [from2] = sets.at(-1)!.label.match(EPISODE_SET_PATTERN) ?? [];
    if (from1 && from2 && from1 > from2) {
        const result = new Array<PlaylistEpisode>();
        const leftovers = episodes.filter(f => f.id.split("_").length <= setIdPos);
        sets.forEach((s) => {
            result.unshift(...episodes.filter(f => matchIDs(f.id, s.id)));
        });
        return result.concat(leftovers);
    }

    return episodes;
}

// * May be incomplete
const studioNames: { short: string; full: string; }[] = [
    { short: "AL", full: "AniLibria" },
    { short: "SR", full: "SovetRomantica" },
    { short: "YRT", full: "YRteam" },
    { short: "TPDB", full: "TheProverbialDustBiter" },
    { short: "UO", full: "Ушастая Озвучка" },
    { short: "YSS", full: "YakuSub Studio" },
    { short: "YS", full: "YakuSub" },
    { short: "PV", full: "Трейлеры" },
    { short: "NF", full: "Netflix" },
    { short: "CR", full: "Crunchyroll" },
];

export function getFullStudioName(name: string | undefined) {
    if (name === undefined || name === "undefined") return undefined;

    return studioNames.find(sn => sn.short === name)?.full ?? name;
}