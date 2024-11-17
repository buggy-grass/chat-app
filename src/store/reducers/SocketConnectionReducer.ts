import ISocketConnectionProps from "../../models/ISocketConnectionProps";
import { Reducer } from "redux";
import IActionsProps from "../../models/IActionsProps";
const initialState: ISocketConnectionProps = {
    connection: 1,
    lastConnection: ""
};

// type Action =
//   | { type: "STORE_USER"; payload: IUserProps }
//   | { type: "GET_USER" };

const SocketConnectionReducer: Reducer<ISocketConnectionProps, IActionsProps> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SOCKET_CONNECTION/CONNECTION":
      return {
        ...state,
        connection: action.payload.connectionStatus
      };
    default:
      return state;
  }
};

export default SocketConnectionReducer;
