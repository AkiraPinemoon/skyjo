export default function () {
  return useState<{
    owner: {
      username: string;
      id: string;
    };
    players: {
      username: string;
      id: string;
    }[];
    phase: string;
    data: {
      lastcard: number | null;
      currentPlayerId: string;
      currentCard: number | null;
      playfields: Object;
    } | null;
    id: string;
  } | null>("game", () => null);
}
