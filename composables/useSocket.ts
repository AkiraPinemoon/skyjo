import { Socket } from "socket.io-client";

export default function () {
  return useState<Socket & {
    auth: {
      playerId: string,
      secret: string,
    },
  } | null>("socket", () => null);
}
