import React from "react"
import {Button, Stack, TextInput} from "@mantine/core";
import {Lock, User} from "lucide-react";

export const LoginForm:React.FC = () => {
    return (
        <div style={{
            width: "100%",
        }}>
            <Stack>
                <TextInput w={"100%"} placeholder={"Логин"} leftSection={<User size={20} />} />
                <TextInput w={"100%"} placeholder={"Пароль"} type={"password"} leftSection={<Lock size={20} />} />
                <Button >Войти</Button>
            </Stack>
        </div>
    )
}