import IUserProps from "../../models/IUserProps";
import { Reducer } from "redux";
import IActionsProps from "../../models/IActionsProps";
const initialState: IUserProps = {
  username: "",
  nickname: "",
  connectedServer: "",
  connectedRoom: "",
};

// type Action =
//   | { type: "STORE_USER"; payload: IUserProps }
//   | { type: "GET_USER" };

const userReducer: Reducer<IUserProps, IActionsProps> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "USER_REDUCER/STORE_USER":
      return {
        ...state,
        username: action.payload.username,
        nickname: action.payload.nickname,
        connectedRoom: "",
        connectedServer: "",
      };
    case "USER_REDUCER/CONNECTED_ROOM":
      return {
        ...state,
        connectedRoom: action.payload.connectedRoom,
      };
    case "USER_REDUCER/CONNECTED_SERVER":
      return {
        ...state,
        connectedServer: action.payload.connectedServer,
      };
    case "USER_REDUCER/SET_LOGIN":
      return {
        ...state,
        isUserLogin: action.payload.isUserLogin,
      };
    case "USER_REDUCER/GET_USER":
      return { ...state };
    case "USER_REDUCER/CHANGE_LANGUAGE":
      return {
        ...state,
        language: action.payload.language,
      };
    default:
      return state;
  }
};

export default userReducer;
