import { eventChannel, END } from 'redux-saga';
import { take, call, put, takeLatest } from 'redux-saga/effects';
import { aqiActions as actions } from '.';
import { AqiSocketDataPoint } from './types';

function websocketInitChannel() {
  return eventChannel(emit => {
    function createNewWebSocketConnection() {
      // Create new socket
      const socket = new WebSocket('wss://city-ws.herokuapp.com/');

      // Log socket opening
      socket.onopen = () => {
        console.log('Opening Websocket');
      };

      // Log socket error
      socket.onerror = error => {
        console.log('ERROR: ', error);
      };

      // Dispatch socket messages to Redux
      socket.onmessage = (e: MessageEvent) => {
        const message: AqiSocketDataPoint[] = JSON.parse(e.data);
        return emit({ type: actions.updateData.type, payload: message });
      };

      // Handle socket closing
      socket.onclose = (e: CloseEvent) => {
        if (e.code === 1005) {
          console.log('Socket closed');
          emit(END); // End the channel
        } else {
          console.log(
            'Socket closed unexpectedly, reconnecting in 5 secs',
            e.reason,
          );
          setTimeout(() => {
            createNewWebSocketConnection();
          }, 5000);
        }
      };
      return socket;
    }
    const websocket = createNewWebSocketConnection();

    // unsubscribe function
    return () => {
      // Interrupt the socket communication here
      console.log('Closing Websocket');
      websocket.close();
    };
  });
}

function* websocketSagas() {
  const channel = yield call(websocketInitChannel);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function* aqiSaga() {
  yield takeLatest(actions.subscribe.type, websocketSagas);
}
