import IServerProps from "./IServerProps";

export default interface IServerState {
    serverList: IServerProps[];
    activeRoomId: string;
}