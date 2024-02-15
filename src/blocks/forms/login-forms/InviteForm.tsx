import React from "react"
import {Button, Stack, TextInput} from "@mantine/core";
import {Key} from "lucide-react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {InviteFormSchema} from "@/schemas/login-forms";
import {InferType} from "yup";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {InviteCode} from "@/types/invite-codes/invite-code";
import {notifications} from "@mantine/notifications";
import InviteRegisterForm from "@/blocks/forms/login-forms/InviteRegisterForm";
import {useDisclosure} from "@mantine/hooks";

export default function InviteForm () {

    const [opened, {open, close}] = useDisclosure()

    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: yupResolver(InviteFormSchema)
    })

    const {mutate, isPending, data} = useMutation({
        mutationKey: ["invite-code-check"],
        mutationFn: async (data: InferType<typeof InviteFormSchema>) => await axios.get<InviteCode>(`/api/auth/invite/${data.code}`),
        onSuccess: (data) => open(),
        onError: (data: AxiosError) => {
            if (data.response?.status == 404 ) {
                notifications.show({
                    title: "Ошибка",
                    message: "Код приглашения неверен",
                    color: "red"
                })
                setError("code", {
                    message: "Код приглашения неверен"
                })
            }
        }
    })

    const onSubmit = (data: InferType<typeof InviteFormSchema>) => {
        mutate(data)
    }

    return (
        <div style={{
            width: "100%",
        }}>
            <Stack>
                <TextInput w={"100%"} placeholder={"Код приглашения"} leftSection={<Key size={20}/>} {...register("code")} error={errors.code?.message}/>
                <Button onClick={handleSubmit(onSubmit)} loading={isPending}>Активировать</Button>
                {data && <InviteRegisterForm opened={opened} close={close} code={data.data}/> }
            </Stack>
        </div>
    )
}