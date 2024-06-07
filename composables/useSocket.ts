import { Socket } from "socket.io-client";

export default function () {
  return useState<Socket & {
    auth: {
      username: string,
    },
  } | null>("socket", () => null);
}
