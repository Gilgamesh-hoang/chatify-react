export type NameSocketEvent =
  | 'REGISTER'
  | 'LOGIN'
  | 'RE_LOGIN'
  | 'LOGOUT'
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'GET_PEOPLE_CHAT_MES'
  | 'GET_ROOM_CHAT_MES'
  | 'SEND_CHAT'
  | 'CHECK_USER'
  | 'GET_USER_LIST';
export interface SocketEvent {
  action: 'onchat';
  data: {
    event: NameSocketEvent;
    data?: object;
  };
}
