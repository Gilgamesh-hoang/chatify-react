import { message } from 'antd';
import { Dispatch } from 'redux';
import { setOnlinePartner } from '~/redux/partnerSlice';
import { socketUpdateStatus } from '~/redux/socketSlice';
import { setUserName } from '~/redux/userSlice';

export const setupWebSocket = (dispatch: Dispatch) => {
  const socket = new WebSocket('ws://140.238.54.136:8080/chat/chat');
  socket.onopen = () => {
    dispatch(socketUpdateStatus('open'));
    console.log('WebSocket connection established');
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'success') {
      switch (data.event) {
        case 'RE_LOGIN':
          const username = localStorage.getItem('userName');
          if (!username) {
            message.error('Not found username');
            localStorage.clear();
            setTimeout(() => {
              window.location.href = '/login';
            }, 200);
          }
          localStorage.setItem('token', data.data.RE_LOGIN_CODE);
          dispatch(setUserName(username!));
          break;
        case 'CHECK_USER':
          dispatch(setOnlinePartner(data.data.status));
          break;
      }
    } else if (data.status === 'error') {
      message.error(data.mes);
      switch (data.event) {
        case 'RE_LOGIN':
          localStorage.clear();
          window.location.href = '/login';
          break;
      }
    } else if (data.action === 'error') {
      message.error(data.data);
    }
    dispatch(socketUpdateStatus('open'));
    console.log(data);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    dispatch(socketUpdateStatus('closed'));
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    dispatch(socketUpdateStatus('error'));
  };

  return socket;
};
