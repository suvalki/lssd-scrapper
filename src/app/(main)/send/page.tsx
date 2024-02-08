"use client";
import {PageHeader} from "@/components/pages/PageHeader";
import {Card, Flex, SegmentedControl, Stack} from "@mantine/core";
import TemplateForm from "@/pages/forms/send-forms/TemplateForm";
import React, {useState} from "react";
import NoTemplateForm from "@/pages/forms/send-forms/NoTemplateForm";
import {useMediaQuery} from "@mantine/hooks";

export default function Page() {

    const [value, setValue] = useState("template")
    const match = useMediaQuery("( max-width: 992px )");

    return (
        <>
            <Flex justify={"space-between"} align={"baseline"}>
                <PageHeader>
                    Отправка письма
                </PageHeader>
                <SegmentedControl data={[{
                    label: "Шаблон",
                    value: "template"
                }, {
                    label: "Без шаблона",
                    value: "row"
                }]} w={"fit-content"} value={value} onChange={setValue}/>
            </Flex>

            <Stack align={"center"} mt={20} mx={!match ? 120 : 2}>

                <Card w={"100%"}>
                    {value === "template" ? <TemplateForm/> : <NoTemplateForm/>}
                </Card>
            </Stack>
        </>
    )
}