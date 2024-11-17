import { combineReducers, legacy_createStore as createStore } from "redux";
import userReducer from "./reducers/UserReducer";
import UserProps from "../models/IUserProps";
import MessagePanelReducer from './reducers/MessagePanelReducer';
import IMesssagePanelProps from "../models/IMessagePanelProps";
import ServerListReducer from './reducers/ServerListReducer';
import IServerListProps from "../models/IServerListProps";
import SocketConnectionReducer from './reducers/SocketConnectionReducer';
import ISocketConnectionProps from '../models/ISocketConnectionProps';

const reducers = combineReducers({
  userReducer: userReducer,
  MessagePanelReducer: MessagePanelReducer,
  ServerListReducer: ServerListReducer,
  SocketConnectionReducer: SocketConnectionReducer
});

export type RootState = {
  userReducer: UserProps;
  MessagePanelReducer: IMesssagePanelProps,
  ServerListReducer: IServerListProps,
  SocketConnectionReducer: ISocketConnectionProps,
};

const store = createStore(reducers);

export default store;
