"use client";
import {PageHeader} from "@/components/pages/PageHeader";
import {Button, Card, Flex, SegmentedControl, Stack, Text, ThemeIcon} from "@mantine/core";
import TemplateForm from "@/blocks/forms/send-forms/TemplateForm";
import React, {useState} from "react";
import NoTemplateForm from "@/blocks/forms/send-forms/NoTemplateForm";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "@/stores/User";
import {Users2} from "lucide-react";
import {useRouter} from "next/navigation";

export default function Page() {
    const {can} = useUser()

    const [value, setValue] = useState(can("send.template") ? "template" : "row")
    const match = useMediaQuery("( max-width: 992px )");
    const {user} = useUser()
    const router = useRouter()

    return (
        <>
            <Flex justify={"space-between"} align={"baseline"}>
                {user?.forumAccounts.length != 0 &&
                    <>
                        <PageHeader>
                            Отправка письма
                        </PageHeader>

                        <SegmentedControl data={[{
                            label: "Шаблон",
                            value: "template",
                            disabled: !can("send.template")
                        }, {
                            label: "Без шаблона",
                            value: "row",
                            disabled: !can("send.noTemplate")
                        }]} w={"fit-content"} value={value} onChange={setValue}/>
                    </>}
            </Flex>

            {user?.forumAccounts.length == 0 ?
                <Flex justify={"center"} w={"100%"} mt={20}>
                    <Stack gap={2} align={"center"}>
                        <ThemeIcon variant={"transparent"} opacity={0.5} color={"white"} size={50}><Users2
                            size={50}/></ThemeIcon>
                        <Text opacity={0.5}>Перед началом работы, Вам необходимо добавить хотя бы один форумный аккаунт</Text>
                        <Button variant={"subtle"} onClick={() => router.push("/settings")} mt={20}>В настройки</Button>
                    </Stack>
                </Flex>
                :
                <Stack align={"center"} mt={20} mx={!match ? 120 : 2}>

                    <Card w={"100%"}>
                        {value === "template" ? <TemplateForm/> : <NoTemplateForm/>}
                    </Card>
                </Stack>
            }


        </>
    )
}