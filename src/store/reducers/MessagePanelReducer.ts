import IMessagePanelProps from "../../models/IMessagePanelProps";
import { Reducer } from "redux";
import IActionsProps from "../../models/IActionsProps";
const initialState: IMessagePanelProps = {
  show: false,
  header: "",
  messages: [],
};

// type Action =
//   | { type: "STORE_USER"; payload: IUserProps }
//   | { type: "GET_USER" };

const messagePanelReducer: Reducer<IMessagePanelProps, IActionsProps> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "MESSAGE_PANEL_REDUCER/OPEN":
      return {
        ...state,
        show: action.payload.show,
        header: action.payload.header,
        messages: action.payload.messages
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

export default messagePanelReducer;
