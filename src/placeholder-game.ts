import {
  Letter,
  PlayerName,
  Game,
  PlayerIndex,
  SocketID,
  PlayerDetails,
} from "./types";

const players: PlayerDetails[] = [
  "JohnL",
  "PaulMcC",
  "George",
  "Ringo",
  "David",
  "Freddie",
  "BrianM",
  "Roger",
  "JohnD",
  "Mick",
  "BrianJ",
  "Keith",
  "Bill",
  "Charlie",
  "Simon",
  "PaulG",
].map((name, i) => ({
  name: name as PlayerName,
  socketID: ("xx_" + name) as SocketID,
  index: i as PlayerIndex,
}));

const placeholderGame: Game = {
  id: 0,
  golden: true,
  players,
  board: {
    size: 31,
    base: [],
    timeline: [{ letters: [], owners: [], squaresWithGas: [], squaresGoingToHaveGas: [] }],
  },
  kills: [],
  winner: null,
  you: {
    MMR: 0,
    oldMMR: 0,
    position: 0,
  },
};
[
  "the",
  "first",
  "and",
  "original",
  "babble",
  "royale",
  "player",
  "log",
  "file",
  "viewer",
  "made",
  "by",
  "glenjamin",
  "aka",
  "glenathan",
].forEach((word, i) => {
  const player = players[i];
  const offset = 1 + (1 + i * 2) * placeholderGame.board.size;
  Array.from(word).forEach((letter, i) => {
    placeholderGame.board.timeline[0].letters[offset + i] = letter as Letter;
    placeholderGame.board.timeline[0].owners[offset + i] = player.name;
  });
});

export default placeholderGame;
