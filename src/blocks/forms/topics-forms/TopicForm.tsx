"use client";
import {Button, Flex, Modal, Stack, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CreateTopicFormSchema} from "@/schemas/topics-forms";
import {InferType} from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {AxiosError} from "axios/index";
import {notifications} from "@mantine/notifications";
import { Topic } from "@/types/topics/topic";

export default function TopicForm({children, type, id, data}: { children: React.ReactNode, type: "create" | "edit", id?: number, data?: Topic }) {

    const queryClient = useQueryClient()

    const [opened, {open, close}] = useDisclosure(false);

    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: yupResolver(CreateTopicFormSchema),
        defaultValues: data && data
    })

    const {mutate, isPending} = useMutation({
        mutationKey: [type == "create" ? "create-topic" : `edit-topic-${id}`],
        mutationFn: async (data: InferType<typeof CreateTopicFormSchema>) => {
            if (type == "create") {
                return await axios.post("/api/forum/topic", data)
            }
            else {
                return await axios.put(`/api/forum/topic/${id}`, data)
            }
        },
        onError: (error:AxiosError) => {
            if (error.response?.status == 404) {
                notifications.show({
                    title: "Ошибка",
                    message: "Указанная ссылка не является темой",
                    color: "red",
                })
                setError("url", {message: "Указанная ссылка не является темой"})
            }
            else if (error.response?.status == 406) {
                notifications.show({
                    title: "Ошибка",
                    message: "Вы не можете отправлять сообщение в этой теме с активного аккаунта",
                    color: "red",
                })
                setError("name", {message: "Вы не можете отправлять сообщение в этой теме с активного аккаунта"})
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-topics"]
            })
            close()
            notifications.show({
                title: "Успешно",
                message: `Тема успешно ${type == "create" ? "создана" : "отредактирована"}`,
                color: "green",
            })

        }
    })
    const onSubmit = (data: InferType<typeof CreateTopicFormSchema>) => {
        mutate(data)
    }

    return (
        <>
            <Modal title={"Добавить тему"} opened={opened} onClose={close}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <TextInput label={"Cсылка на тему"}
                                   placeholder={"Укажите ссылку на тему"} {...register("url")} error={errors.url?.message} hidden={type == "edit"}/>
                        <TextInput label={"Название отслеживаемой темы"}
                                   placeholder={"Укажите название темы"} {...register("name")} error={errors.name?.message}/>
                    </Stack>

                <Flex justify={"space-between"} align={"center"} mt={20}>
                    <Button variant={"subtle"} onClick={close} color={"red"}>Отмена</Button>
                    <Button type={"submit"} loading={isPending}>Отправить</Button>
                </Flex>
                </form>
            </Modal>
            <div onClick={open}>
                {children}
            </div>
        </>
    )
}