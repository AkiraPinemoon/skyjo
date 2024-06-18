export default function () {
  return useCookie<{
    playerId: string,
    username: string,
    secret: string,
    socketId: string | null,
    gameId: string | null,
  } | null>("player");
}
