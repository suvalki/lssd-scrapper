"use client";
import {useDisclosure} from "@mantine/hooks";
import {Accordion, ActionIcon, Button, Flex, Modal, Select, Stack, TextInput} from "@mantine/core";
import {InviteCode} from "@/types/invite-codes/invite-code";
import {Copy} from "lucide-react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {InvitesFormSchema} from "@/schemas/admin-forms/invites-forms";
import {InferType} from "yup";
import {copyMessage} from "@/utils/notifications/copy-notification";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {notifications} from "@mantine/notifications";
import {Role} from "@/types/users/role";
import {useUser} from "@/stores/User";

export default function MutateModal({children, initialData}: { children: React.ReactNode, initialData?: InviteCode }) {

    const [opened, {close, open}] = useDisclosure()
    const queryClient = useQueryClient()

    const {user} = useUser()

    const {register, handleSubmit, setValue, control, getValues, formState: {errors}} = useForm({
        resolver: yupResolver(InvitesFormSchema)
    })

    const onSubmit = (data: InferType<typeof InvitesFormSchema>) => {
        mutate(data)
    }

    const {mutate, isPending} = useMutation({
        mutationKey: ["admin-invites-create"],
        mutationFn: async (data: InferType<typeof InvitesFormSchema>) => await axios.post<InviteCode>("/api/admin/invites", data),
        onSuccess: () => {
            notifications.show({
                title: "Успешно",
                message: "Код приглашения создан",
                color: "green",
            })
            close()
            queryClient.invalidateQueries({
                queryKey: ["admin-invites"]
            })
        }
    })

    const {data, isLoading} = useQuery({
        queryKey: ["roles"],
        queryFn: async () => await axios.get<Role[]>("/api/admin/roles"),
        refetchOnWindowFocus: false
    })

    const keyGenerator = (sections: number) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < sections * 5; i++) {
            if (i % 5 === 0 && i > 0) {
                result += '-';
            }
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }


    return (
        <>
            <span onClick={open}>{children}</span>

            <Modal opened={opened} onClose={close}
                   title={initialData ? "Редактирование кода приглашения" : "Создание кода приглашения"}>
                <Stack>
                    <TextInput label={"Код приглашения"} placeholder={"Введите код приглашения"}
                               error={errors.code?.message} rightSection={
                        <ActionIcon variant={"transparent"} color={"dark"} onClick={() => {
                            window.navigator.clipboard.writeText(getValues("code"))
                            copyMessage()
                        }}>
                            <Copy/>
                        </ActionIcon>
                    } {...register("code")} />
                    <Button variant={"subtle"} color={"gray"}
                            onClick={() => setValue("code", keyGenerator(4))}>Сгенерировать</Button>
                    <Controller render={({field}) =>
                        <Select label={"Роль"} placeholder={"Выберите роль"}
                                data={data && [...data.data.filter(role => role.permissions.length <= (user?.role.permissions.length || 0)).map(role => ({value: String(role.id), label: role.name}))]}
                                onChange={field.onChange} value={field.value}
                                error={(errors.roleId?.message as string)}/>
                    } name={"roleId"} control={control}/>
                    <Flex justify={"space-between"} align={"center"} mt={20}>
                        <Button variant={"subtle"} color={"red"} onClick={close}>Отмена</Button>
                        <Button onClick={handleSubmit(onSubmit)} loading={isPending}>Сохранить</Button>
                    </Flex>
                </Stack>
            </Modal>
        </>
    )
}