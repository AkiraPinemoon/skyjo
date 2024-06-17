export default function () {
  return useCookie<{
    playerId: string,
    secret: string,
  } | null>("player");
}
