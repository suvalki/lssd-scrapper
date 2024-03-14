"use client";
import React, {JSXElementConstructor, ReactElement, useEffect} from "react"
import {Button, Divider, Flex, Grid, Group, Select, Stack, Textarea, TextInput} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "@/stores/User";
import {Controller, useForm, useWatch} from "react-hook-form";
import {Fields, FormElementInstance} from "@/types/templates/template";
import {replacer} from "@/utils/text-helpers/replacer";
import {modals} from "@mantine/modals";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";

export default function TemplateForm() {

    const match = useMediaQuery("( max-width: 992px )");

    const {user} = useUser()

    const {register, control, handleSubmit, setError, formState: {errors}, unregister} = useForm()


    const {mutate, isPending} = useMutation({
        mutationKey: ["send-message-template"],
        mutationFn: async (data: any) => await axios.post("/api/forum", data),
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

    const values = useWatch({
        control: control
    })

    const codeReplacer = (data: Record<string, string>) => {
        const fields = {
            // @ts-ignore
            ...JSON.parse(user?.templates.filter((template) => Number(template.id) === Number(values.template))[0].elements).map((element: FormElementInstance) => {
                const field: {} = {};
                // @ts-ignore
                field[element.uid as keyof typeof field] = Fields[
                    element.type as keyof typeof Fields
                    ].getValues(
                    element,
                    values[element.uid + "-field"]
                ).rawValue;
                return {...field};
            }).reduce((acc: any, curr: any) => ({...acc, ...curr}))
        }


        const code = replacer({
            // @ts-ignore
            content: user?.templates.filter((template) => Number(template.id) === Number(values.template))[0].code,
            data: {
                ...fields,
                date: {
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString('ru-RU', {hour: "2-digit", minute: "2-digit"}),
                },
                user: {
                    name: user?.name
                },
                recipient: values.recipients,
                forum: {
                    name: user?.forumAccounts.filter((account) => account.active)[0].login
                }
            }
        })

        return code
    }


    const onSubmit = (data: Record<string, string>) => {


        const code = codeReplacer(data)


        mutate({
            message: code,
            subject: data.subject,
            recipients: data.recipients
        })


    }

    const showCodeModal = (data: Record<string, string>) => {

        const code = codeReplacer(data)

        return modals.openConfirmModal({
            title: 'Код',
            centered: true,
            size: "lg",
            children: <><Textarea value={code} autosize/></>,
            labels: {
                cancel: "Закрыть",
                confirm: "Копировать"
            },
            onConfirm: () => {
                window.navigator.clipboard.writeText(code)
            }
        })
    }

    useEffect(() => {
        if (values.template) {
            // @ts-ignore
            Object.keys(values).forEach((key) => {
                if (key != "template" && key != "recipients" && key != "subject" &&
                    // @ts-ignore
                    !JSON.parse(user?.templates.filter((template) => Number(template.id) === Number(values.template))[0].elements)
                        .some((el: FormElementInstance) => `${el.uid}-field` == key)) {
                    unregister(key)
                }
            })
        }
    }, [values.template])

    return (
        <Stack gap={10}>
            <Controller render={({field}) =>
                <Select label="Шаблон" w={"100%"} placeholder={"Выберите шаблон"}
                        data={
                            user?.templates && [...user?.templates?.map((template) => ({
                                value: String(template.id),
                                label: template.name
                            }))]
                        }
                        searchable onChange={field.onChange} value={field.value}/>
            }
                        control={control}
                        name={"template"}
                        rules={{
                            required: "Выберите шаблон"
                        }}
            />
            {values.template &&
                <>
                    <Textarea label={"Получатель"} w={"100%"}
                              placeholder={"Напишите получателя"} {...register("recipients", {required: "Обязательное поле"})}
                              error={(errors.recipients?.message) as string} autosize/>
                    <TextInput label={"Тема"} w={"100%"}
                               placeholder={"Напишите тему письма"}  {...register("subject", {required: "Обязательное поле"})}
                               error={(errors.subject?.message) as string}/>
                    <Divider mt={10}/>
                    <Grid columns={!match ? 2 : 1} grow>
                        {/*@ts-ignore*/}
                        {JSON.parse(user?.templates.filter((template) => Number(template.id) === Number(values.template))[0].elements).map((el: FormElementInstance) => {
                            return (
                                <Grid.Col key={el.uid} span={1}>
                                    <Controller render={({field}) =>
                                        (Fields[el.type].formElement({
                                            instance: el,
                                            value: field.value,
                                            onChange: field.onChange,
                                            // @ts-ignore
                                            error: errors[el.uid + "-field"]?.message
                                        })) as ReactElement<any, string | JSXElementConstructor<any>>}
                                                name={`${el.uid}-field`}
                                                control={control} rules={{
                                        required: el.extraAttributes?.required ? "Заполните поле" : false
                                    }}/>
                                </Grid.Col>)
                        })}
                    </Grid>
                    <Flex justify={"space-between"} align={"center"}>
                        <Button color={"red"} variant={"subtle"}>Очистить</Button>
                        <Group>
                            <Button onClick={handleSubmit(showCodeModal)} disabled={!values.template}
                                    variant={"subtle"}>Показать
                                код</Button>
                            <Button onClick={handleSubmit(onSubmit)} loading={isPending} disabled={!values.template}>Отправить</Button>
                        </Group>
                    </Flex>
                </>
            }
        </Stack>
    )
}