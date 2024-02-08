import React from "react"
import {Button, Divider, Flex, Grid, Select, Stack, Textarea, TextInput} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

export default function TemplateForm() {

    const match = useMediaQuery("( max-width: 992px )");

    return (
        <Stack gap={10}>
            <Select label="Шаблон" w={"100%"} placeholder={"Выберите шаблон"}
                          data={[{
                              label: "Шаблон 1",
                              value: "1"
                          }]} searchable/>
            <Textarea label={"Получатели"} w={"100%"} placeholder={"Выберите получателеи"}/>
            <Divider mt={10}/>
            <Grid columns={!match ? 2 : 1} grow>
                <Grid.Col span={1}>
                    <TextInput/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <TextInput/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <TextInput/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <TextInput/>
                </Grid.Col>
            </Grid>
            <Flex justify={"space-between"} align={"center"}>
                <Button color={"red"} variant={"subtle"}>Очистить</Button>
                <Button>Отправить</Button>
            </Flex>
        </Stack>
    )
}