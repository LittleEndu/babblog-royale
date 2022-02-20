const fs = require("fs");

process.env.BABEL_ENV ??= "test";
require("@babel/register")({
  presets: ["react-app"],
  extensions: [".ts"]
});

const { newParser } = require("./src/parser");
const { findCurrentlyPlayedWord } = require("./src/Play");

const filename = process.argv[2];
if (!filename) {
  console.warn(`Usage: node main.js <path-to-babble-royale-player-log>
    
On macOS the file is at '~/Library/Logs/Everybody House Games/BabbleRoyale/Player.log'
On windows the file is at 'C:\\Users\\[YOURUSERNAME]\\AppData\\LocalLow\\Everybody House Games\\BabbleRoyale\\Player.log'
`);
  process.exit(1);
}
const parser = newParser();
const stream = fs.createReadStream(filename);
stream.on("data", (chunk) => parser.parse(chunk.toString()));
stream.once("close", () => {
  parser.end();
  const games = parser.games();
  /**
   * @type {{ playedWords: string[]; incidentalWords: string[]; players: string[] }[]}
   */
  const allPlays = [];
  console.log(`Found ${games.length} games`);
  games.forEach(game => {
    console.log(`Game ${game.id}`);
    let playedWords = [];
    let incidentalWords = [];
    for (let player of game.players) {
      incidentalWords.push(player.startingLetter);
    }
    for (let playerIndex = 0; playerIndex < 16; playerIndex++) {
      let playedWord = "";
      for (let currentStep = 0; currentStep < game.timeline.length; currentStep++) {
        // @ts-ignore
        const currentPlay = findCurrentlyPlayedWord(game, currentStep, playerIndex);
        if (!currentPlay.isValid || currentPlay.word.length < 2) {
          continue;
        }
        if (currentPlay.word !== playedWord){
          playedWord = currentPlay.word;
          playedWords.push(playedWord);
          for (const play of currentPlay.findPlaysAcross()) {
            if (play.isSameWordSamePosition(currentPlay)) continue;
            if (play.word.length > 1) {
              incidentalWords.push(play.word);
            }
          }
        }
      }
    }
    allPlays.push({
      playedWords,
      incidentalWords,
      players: game.players.map(player => player.name)
    });
  });

  // write allPlays to .json file
  const json = JSON.stringify(allPlays, null, 2);
  fs.writeFileSync("./allPlays.json", json);
});

