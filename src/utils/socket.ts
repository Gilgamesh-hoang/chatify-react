import { message } from "antd";
import { Dispatch } from "redux";

export const setupWebSocket = (dispatch: Dispatch) => {
  const socket = new WebSocket('ws://140.238.54.136:8080/chat/chat');
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'success') {
      switch (data.event) {
        case "LOGIN" : 
           
          break;
      }
    } else if (data.status === 'error') {
      message.error(data.mes);
    } else if (data.action === 'error') {
      message.error(data.data);
    }
    
    console.log(data);
    // dispatch(socketReceiveMessage(message));
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};
