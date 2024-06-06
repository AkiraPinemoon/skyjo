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
    state: string;
    data: Object;
    id: string;
  } | null>("game", () => null);
}
