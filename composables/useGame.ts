export default function () {
  return useState<{
    owner: {
      username: string;
      socketId: string;
    };
    players: [
      {
        username: string;
        socketId: string;
      }
    ];
    phase: string;
    data?: {
      lastcard: number;
      currentPlayerId: string;
      playfields: Object;
    };
    id: string;
  } | null>("game", () => null);
}
