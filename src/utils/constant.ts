class Constant {
  msgInviteGroup: (name: string) => string = (name) =>
    `Hãy tham gia nhóm chat ${name} để cùng nhau trò chuyện nào`;
}
export default new Constant();
