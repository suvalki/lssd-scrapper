import React from "react"
import {Button, Stack, TextInput} from "@mantine/core";
import {Key} from "lucide-react";

export default function InviteForm () {
    return (
        <div style={{
            width: "100%",
        }}>
            <Stack>
                <TextInput w={"100%"} placeholder={"Код приглашения"} leftSection={<Key size={20}/>}/>
                <Button>Войти</Button>
            </Stack>
        </div>
    )
}