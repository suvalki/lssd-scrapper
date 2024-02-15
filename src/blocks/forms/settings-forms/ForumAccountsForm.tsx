"use client";
import {ActionIcon, Button, Card, Divider, Flex, Group, Modal, Radio, Stack, Text, TextInput} from "@mantine/core";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {forumAccountsFormSchema} from "@/schemas/settings-forms";
import {InferType} from "yup";
import {useDisclosure} from "@mantine/hooks";
import {Pen, Plus, Trash} from "lucide-react";
import React from "react";
import {notifications} from "@mantine/notifications";
import {useUser} from "@/stores/User";
import {ForumAccount} from "@/types/forum-accounts/forum-account";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {modals, openConfirmModal} from "@mantine/modals";

export default function ForumAccountsForm() {

    const {user} = useUser()

    const queryClient = useQueryClient()

    const deleteAccountMutation = useMutation({
        mutationKey: ["forum-accounts-delete"],
        mutationFn: async (id: number) => await axios.delete(`/api/forum-accounts`, {
            data: {
                id: id
            }
        }),
        onSuccess: () => {
            notifications.show({
                title: "Успешно",
                message: "Аккаунт удален",
                color: "green",
            })
            queryClient.invalidateQueries({
                queryKey: ["me"]
            })
        }
    })

    const switchAccountActive = useMutation({
        mutationKey: ["forum-accounts-swich-active"],
        mutationFn: async ({id, login}: { id: number, login: string }) => await axios.put(`/api/forum-accounts/switch`, {
            id: id,
        }),
        onSuccess: (data, variables) => {
            notifications.show({
                title: "Успешно",
                message: `Аккаунт ${variables.login} выбран активным`,
                color: "green",
            })
            queryClient.invalidateQueries({
                queryKey: ["me"]
            })
        }
    })

    const showConfirmModal = (id: number) => modals.openConfirmModal({
        title: "Удаление аккаунта",
        centered: true,
        children: (
            <Text>
                Вы уверены, что хотите удалить этот аккаунт?
            </Text>
        ),
        labels: {confirm: "Удалить", cancel: "Отмена"},
        confirmProps: {color: "red"},
        onConfirm: () => deleteAccountMutation.mutate(id)
    })

    return (
        <>
            <Card w={"100%"}>
                <Stack mb={10} gap={5}>
                    <Group justify={"space-between"} align={"center"}>
                        <Text opacity={0.5}>Форумные аккаунты</Text>
                        <FormModal>
                            <Button leftSection={<Plus/>} size={"xs"} variant={"subtle"}>Добавить</Button>
                        </FormModal>
                    </Group>
                    <Divider/>
                </Stack>
                {user?.forumAccounts?.map(el =>
                    <Group key={el.id} align={"center"} justify={"space-between"}>
                        <Group>
                            <Radio value={el.id} checked={el.active} onChange={() => switchAccountActive.mutate({login: el.login, id: el.id})} />
                            <Text>{el.login}</Text>
                        </Group>
                        <Group>
                            <ActionIcon variant={"subtle"} color={"red"} onClick={() => showConfirmModal(el.id)}><Trash size={20}/></ActionIcon>
                            <FormModal account={el}>
                                <ActionIcon variant={"subtle"}><Pen size={20}/></ActionIcon>
                            </FormModal>
                        </Group>
                    </Group>
                )}

            </Card>
        </>
    )
}

function FormModal({account, children}: {
    account?: ForumAccount,
    children: React.ReactNode
}) {

    const [opened, {open, close}] = useDisclosure(false);

    const queryClient = useQueryClient()

    const {register, handleSubmit, reset, formState: {errors}, setError} = useForm({
        resolver: yupResolver(forumAccountsFormSchema),
        defaultValues: {
            login: account ? account.login : "",
            password: account ? account.password : "",
        }
    });

    const switchAccountActive = useMutation({
        mutationKey: ["forum-accounts-swich-active"],
        mutationFn: async ({id}: { id: number }) => await axios.put(`/api/forum-accounts/switch`, {
            id: id,
        }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["me"]
            })
        }
    })

    const {mutate, isPending} = useMutation({
        mutationKey: [account ? `forum-accounts-update-${account.id}` : `forum-accounts-create` ],
        mutationFn: async (data: InferType<typeof forumAccountsFormSchema>) => {
            if (account) {
                return await axios.put<ForumAccount>(`/api/forum-accounts`, {id: account.id, ...data})
            } else {
                return await axios.post<ForumAccount>(`/api/forum-accounts/`, data)
            }
        },
        onSuccess: (account) => {
            notifications.show({
                title: "Успешно",
                message: `Аккаунт ${account ? "изменен" : "добавлен"}!`,
                color: "green",
            })
            close()

            !account && reset({login: "", password: ""})

            switchAccountActive.mutate({id: account.data.id})
        },
        onError: (data: AxiosError) => {
            console.log(data)
            if (data?.response?.status == 404) {
                notifications.show({
                    title: "Ошибка",
                    message: "Аккаунт не найден!",
                    color: "red",
                })
                setError("login", {
                    message: "Аккаунт не найден",
                    type: "custom",
                })
            }
        }
    })

    const onSubmit = (data: InferType<typeof forumAccountsFormSchema>) => {
        mutate(data)
    }

    return (
        <>
            <Modal title={account ? "Изменить аккаунт" : "Новый аккаунт"} opened={opened} onClose={close}>
                <Group mb={20}>
                    <TextInput w={"100%"} label="Логин" placeholder={"Введите логин"} {...register("login")}
                               error={errors.login?.message}/>
                    <TextInput w={"100%"} label="Пароль" type={"password"}
                               placeholder={"Введите пароль"} {...register("password")}
                               error={errors.password?.message}/>
                </Group>
                <Flex justify={!account ? "space-between": "end"} align={"center"}>
                    {!account && <Button color={"red"} variant={"subtle"} onClick={() => reset({login: "", password: ""})}>Очистить</Button>}
                    <Button onClick={handleSubmit(onSubmit)} loading={isPending}>{account ? "Изменить" : "Добавить"}</Button>
                </Flex>
            </Modal>
            <span onClick={open}>{children}</span>
        </>
    )


}