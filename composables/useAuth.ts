export default function () {
  return useState<{
    isOpen: boolean,
  }>("auth", () => { return {
    isOpen: false,
}});
}
