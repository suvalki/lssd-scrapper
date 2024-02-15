import React from "react"
import {Button, Stack, TextInput} from "@mantine/core";
import {Lock, User as UserIcon} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {InferType} from "yup";
import {LoginFormSchema} from "@/schemas/login-forms";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {notifications} from "@mantine/notifications";
import {User} from "@/types/users/user";
import axios, {AxiosError} from "axios";
import {useRouter} from "next/navigation";
export default function LoginForm() {

    const router = useRouter()

    const {register, handleSubmit, formState: {errors}  } = useForm({resolver: yupResolver(LoginFormSchema)})

    const {mutate, isPending} = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: InferType<typeof LoginFormSchema>) => await axios.post<User & {token: string}>("/api/auth", data),
        onSuccess: async (data) => {
            notifications.show({
                title: "Успешно",
                message: "Вы успешно вошли " + data.data.name
            })
            router.push("/send")
        },
        onError: async (data: AxiosError) => {
            data.response?.status == 404 && notifications.show({
                title: "Ошибка",
                message: "Неверный логин или пароль",
                color: "red"
            })
        }
    })

    const onSubmit = (data: InferType<typeof LoginFormSchema>) => mutate(data)

    return (
        <div style={{
            width: "100%",
        }}>
            <Stack>
                <TextInput w={"100%"} placeholder={"Логин"} leftSection={<UserIcon size={20} />} {...register("login")} error={errors.login?.message} />
                <TextInput w={"100%"} placeholder={"Пароль"} type={"password"} leftSection={<Lock size={20} />} {...register("password")} error={errors.password?.message} />
                <Button onClick={handleSubmit(onSubmit)} loading={isPending}>Войти</Button>
            </Stack>
        </div>
    )
}