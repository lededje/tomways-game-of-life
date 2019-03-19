const terminalOverwrite = require('terminal-overwrite');
const chalk = require('chalk');

const defaultMap = [
  ['L', 'L', 'W', 'W', 'L'],
  ['L', 'L', 'L', 'L', 'L'],
  ['L', 'W', 'W', 'L', 'L'],
  ['L', 'L', 'L', 'W', 'L'],
  ['L', 'L', 'L', 'L', 'L'],
];

const resources = {
  food: 0,
  population: 0,
};

let gameTimer;
let currentTick = 0;
let state = defaultMap;



const tick = (state) => {
  const nextState = state.map((row, x) => {
    return row.map((tile, y) => {
      const totals = totalNeighbours(state, [x, y]);

      let newTile = tile;

      if(tile === 'L' && totals.water >= 2) {
        newTile = 'F';
      } else if(tile === 'L' && totals.farm >= 2) {
        newTile = 'C';
      }

      if(tile === 'F') {
        resources.food++;
      } else if(tile === 'C' && resources.food >= 5) {
        resources.food -= 5;
        resources.population++;
      }

      return newTile;
    })
  });

  return nextState;
}

const totalNeighbours = (state, chords) => {
  const neighbours = getNeighbours(state, chords);

  const totals = {
    water: 0,
    land: 0,
    farm: 0,
    city: 0,
  };

  Object.values(neighbours).forEach(val => {
    if(val === 'W') {
      totals.water ++;
    }
    if(val === 'L') {
      totals.land ++;
    }
    if(val === 'C') {
      totals.city ++;
    }
    if(val === 'F') {
      totals.farm ++;
    }
  })

  return totals;
}

const getNeighbours = (state, chords) => {
  const result = {}
  try {
    result.up = state[chords[0] - 1][chords[1]];
  } catch (e) {
    result.up = undefined;
  }
  try {
    result.down = state[chords[0] + 1][chords[1]];
  } catch (e) {
    result.down = undefined;
  }
  try {
    result.left = state[chords[0]][chords[1] - 1];
  } catch (e) {
    result.left = undefined;
  }
  try {
    result.right = state[chords[0]][chords[1] + 1];
  } catch (e) {
    result.right = undefined;
  }
  return result;
}

const render = (state) => {
  const tiles = state.map((row) => {
    return row.map((tile) => {
      switch(tile) {
        case 'L': {
          return chalk.greenBright('██');
        }
        case 'C': {
          return chalk.grey('██');
        }
        case 'F': {
          return chalk.green('██');
        }
        case 'W': {
          return chalk.blue('██');
        }
        default: {
          return '?';
        }
      }
    });
  });

  const frame = tiles.map((row) => {
    return row.join('');
  }).join('\n')

  terminalOverwrite(frame);
}

gameTimer = setInterval(() => {
  render(state);
  state = tick(state);
}, 1000)

process.once('SIGUR2', () => {
  clearInterval(gameTimer)
});
