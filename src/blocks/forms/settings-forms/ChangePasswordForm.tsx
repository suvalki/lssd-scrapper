"use client";
import {Button, Card, Divider, Flex, Group, Stack, Text, TextInput} from "@mantine/core";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changePasswordFormSchema} from "@/schemas/settings-forms";
import {InferType} from "yup";
import {useMediaQuery} from "@mantine/hooks";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";

export default function ChangePasswordForm() {

    const {register, handleSubmit, formState: {errors}, setError, resetField} = useForm({
        resolver: yupResolver(changePasswordFormSchema)
    });

    const {mutate, isPending} = useMutation({
        mutationKey: ["changePassword"],
        mutationFn: async (data: InferType<typeof changePasswordFormSchema>) => await axios.post("/api/profile/change-password", data),
        onSuccess: () => {
            notifications.show({
                title: "Успешно!",
                message: "Пароль успешно изменен",
                color: "green",
            })
            resetField("oldPassword")
            resetField("newPassword")
            resetField("confirmPassword")
        },
        onError: (data: AxiosError) => {
            if (data.response?.status == 403) {
                setError("oldPassword", {message: "Неверный пароль"})
            }
        }
    })

    const onSubmit = (data: InferType<typeof changePasswordFormSchema>) => {
        mutate(data)
    }

    return (
        <>
            <Card w={"100%"}>
                <Stack mb={10} gap={5}>
                    <Text opacity={0.5}>Сменить пароль</Text>
                    <Divider/>
                </Stack>
                <Group align={"end"}>
                    <TextInput w={"100%"} label="Старый пароль" placeholder={"Введите старый пароль"}
                               type={"password"} {...register("oldPassword")}
                               error={errors.oldPassword?.message}/>

                    <TextInput w={"100%"} label="Новый пароль" description="Минимальная длина пароля 6 символов"
                               placeholder={"Введите новый пароль"}
                               type={"password"} {...register("newPassword")} error={errors.newPassword?.message}/>

                    <TextInput w={"100%"} label="Подтвердите пароль" placeholder={"Подтвредите новый пароль"}
                               type={"password"} {...register("confirmPassword")}
                               error={errors.confirmPassword?.message}/>

                    <Button w={"100%"} onClick={handleSubmit(onSubmit)} loading={isPending}>Сменить пароль</Button>
                </Group>
            </Card>
        </>
    )
}