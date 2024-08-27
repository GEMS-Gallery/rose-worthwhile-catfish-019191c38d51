export const idlFactory = ({ IDL }) => {
  const Position = IDL.Record({ 'x' : IDL.Float64, 'y' : IDL.Float64 });
  const GameState = IDL.Record({
    'playerPosition' : Position,
    'housePosition' : Position,
  });
  return IDL.Service({
    'enterHouse' : IDL.Func([], [IDL.Bool], []),
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'initializeGame' : IDL.Func([], [GameState], []),
    'movePlayer' : IDL.Func([IDL.Text], [GameState], []),
  });
};
export const init = ({ IDL }) => { return []; };
