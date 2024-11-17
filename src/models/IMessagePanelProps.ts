export default interface IMesssagePanelProps {
    show: boolean,
    header: string,
    messages: {
        user: string,
        message: string
    }[]
}