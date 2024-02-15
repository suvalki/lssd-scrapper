import {notifications} from "@mantine/notifications";

export const copyMessage = () => {
    notifications.show({
        title: "Успешно",
        message: "Скопировано",
        color: "green"
    })
}