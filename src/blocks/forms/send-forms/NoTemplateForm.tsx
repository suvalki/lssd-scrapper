"use client";
import React from "react"
import {Button, Flex, Grid, Stack, Textarea, TextInput} from "@mantine/core";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {noTemplateFormSchema} from "@/schemas/send-forms";
import {InferType} from "yup";
import {Whisper} from "next/dist/compiled/@next/font/dist/google";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios/index";

export default function NoTemplateForm()  {

    const {mutate, isPending} = useMutation({
        mutationKey: ["sendEmail"],
        mutationFn: async (values: InferType<typeof noTemplateFormSchema>) => await fetch("/api/forum", {
            method: "POST",
            body: JSON.stringify(values)
        }),
        onSuccess: () => {
            notifications.show({
                title: "Успешно",
                message: "Сообщение успешно отправлено",
                color: "green",
            })
        },
        onError: (data: AxiosError) => {
            if (data.response?.status == 404) {
                notifications.show({
                    title: "Ошибка",
                    message: "Получатель не найден",
                    color: "red",
                })
                setError("recipients", {
                    message: "Получатель не найден"
                })
            }
        }
    })

    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: yupResolver(noTemplateFormSchema)
    })


    const onSubmit = (values: InferType<typeof noTemplateFormSchema>) => {
        mutate(values)
    }


    return (
        <>
            <Stack gap={10}>
                <Grid columns={2} grow>
                    <Grid.Col span={1}>
                        {/*@ts-ignore*/}
                        <TextInput label={"Получатели"} w={"100%"} placeholder={"Напишите получателя"} {...register("recipients")} error={errors.recipients?.message}/>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <TextInput label={"Тема"} w={"100%"} placeholder={"Напишите тему"} {...register("subject")} error={errors.subject?.message}/>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Textarea label={"Текст сообщения"} w={"100%"} placeholder={"Напишите текст сообщения"} {...register("message")} error={errors.message?.message}/>
                    </Grid.Col>
                </Grid>
                <Flex justify={"space-between"} align={"center"}>
                    <Button color={"red"} variant={"subtle"}>Очистить</Button>
                    <Button onClick={handleSubmit(onSubmit)} loading={isPending}>Отправить</Button>
                </Flex>
            </Stack>
        </>
    )
}