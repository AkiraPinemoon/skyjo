import { Socket } from "socket.io-client";

export default function () {
  return useState<Socket | null>("socket", () => null);
}
