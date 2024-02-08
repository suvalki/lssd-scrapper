"use client";

import {Flex, SegmentedControl, Stack, Title} from "@mantine/core";
import {useState} from "react";
import LoginForm from "@/pages/forms/login-forms/LoginForm";
import {Mail} from "lucide-react";
import InviteForm from "@/pages/forms/login-forms/InviteForm";

export default function Page() {

    const [value, setValue] = useState("login")

    return (
        <main>
            <Stack justify={"center"} align={"center"} h={"100vh"}>
                <div>
                    <Flex align={"center"} gap={"0.5rem"}>
                        <Mail size={"3rem"}/>
                        <Title>Почта</Title>
                    </Flex>
                </div>
                <div style={{
                    width: "20rem",
                }}>
                    <SegmentedControl data={[{
                        label: "Вход",
                        value: "login"
                    }, {
                        label: "Код приглашения",
                        value: "invite"
                    }]} w={"100%"} value={value} onChange={setValue}/>
                </div>
                <div style={{
                    width: "20rem",
                    paddingRight: "0.5rem",
                    paddingLeft: "0.5rem",
                }}>
                    {value === "login" ? <LoginForm/> : <InviteForm/>}
                </div>
            </Stack>
        </main>
    );
}
