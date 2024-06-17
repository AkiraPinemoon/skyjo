
export function maskPlayfield(
  playfield: { value: number; isVisible: boolean }[][]
): { value: number | null; isVisible: boolean }[][] {
  return playfield.map((column) => {
    return column.map((slot) => {
      return {
        value: slot.isVisible ? slot.value : null,
        isVisible: slot.isVisible,
      };
    });
  });
}

export function revealPlayfield(
  playfield: { value: number; isVisible: boolean }[][]
): { value: number | null; isVisible: boolean }[][] {
  return playfield.map((column) => {
    return column.map((slot) => {
      return {
        value: slot.value,
        isVisible: true,
      };
    });
  });
}

export function objectMap(o: Object, fn: Function): Object {
  Object.keys(o).forEach((key) => {
    o[key as keyof typeof o] = fn(o[key as keyof typeof o]);
  });
  return o;
}

export function getNextPlayerId(g: {
  owner: { id: string };
  players: { id: string }[];
  data: { currentPlayerId: string };
}): string {
  if (g.data.currentPlayerId == g.owner.id) {
    if (g.players.length > 0) return g.players[0].id;
    return g.data.currentPlayerId;
  } else {
    const idx = g.players.findIndex((player) => player.id == g.data.currentPlayerId)
    if (idx == -1) return g.data.currentPlayerId;
    if (idx + 1 >= g.players.length) return g.owner.id;
    return g.players[idx + 1].id;
  }
}
