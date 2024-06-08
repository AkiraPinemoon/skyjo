export default function () {
  return useState<{
    owner: {
      username: string;
      socketId: string;
    };
    players: {
      username: string;
      socketId: string;
    }[];
    phase: string;
    data: {
      lastcard: number | null;
      currentPlayerId: string;
      playfields: Object;
    } | null;
    id: string;
  } | null>("game", () => null);
}
