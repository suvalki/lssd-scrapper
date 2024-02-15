import {Button, Divider, Flex, Modal, Stack, Text, TextInput, ThemeIcon} from "@mantine/core";
import {CheckCircle} from "lucide-react";
import {InviteCode} from "@/types/invite-codes/invite-code";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {InviteRegisterFormSchema} from "@/schemas/login-forms";
import {InferType} from "yup";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";
import {setCookie} from "cookies-next";
import {User} from "@/types/users/user";
import {useUser} from "@/stores/User";
import {useRouter} from "next/navigation";

export default function InviteRegisterForm({opened, close, code}: {
    opened: boolean,
    close: () => void,
    code: InviteCode
}) {

    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: yupResolver(InviteRegisterFormSchema)
    })

    const {login} = useUser()
    const router = useRouter()

    const {mutate, isPending} = useMutation({
        mutationKey: ["invite-code-register"],
        mutationFn: async (data: InferType<typeof InviteRegisterFormSchema>) => await axios.post<User & {
            token: string
        }>(`/api/auth/invite`, {
            code: code.code,
            ...data
        }),
        onSuccess: (data) => {
            close()
            notifications.show({
                title: "Успешно",
                message: "Аккаунт успешно создан",
                color: "green"
            })
            router.push("/send")
        },
        onError: (data: AxiosError) => {
            if (data.response?.status == 400) {
                setError("login", {message: "Пользователь с таким логином уже существует"})
            }
        }
    })

    const onSubmit = (data: InferType<typeof InviteRegisterFormSchema>) => {
        mutate(data)
    }

    return <>
        <Modal opened={opened} onClose={close} title={
            <Flex align={"center"} gap={20}>
                <ThemeIcon size={40} variant={"transparent"}>
                    <CheckCircle size={40}/>
                </ThemeIcon>
                <Stack gap={0}>
                    <Text fw={500}>Код приглашения действителен!</Text>
                    <Text opacity={0.5} fz={12}>Вас пригласил: {code.created.name}</Text>
                </Stack>
            </Flex>
        } withCloseButton={false}>
            <Stack>
                <Text opacity={0.5}>Для продолжения, Вам необходимо заполнить поля формы ниже, указав данные
                    аккаунта</Text>
                <Divider/>
                <Stack gap={0}>
                    <Text opacity={0.5} fz={12}>Роль в системе</Text>
                    <Text>{code.role.name}</Text>
                </Stack>
                <TextInput label={"Имя"} placeholder={"Ввведите ваше имя"} {...register("name")}
                           error={errors.name?.message}/>
                <TextInput label={"Логин"} placeholder={"Ввведите ваш логин"}
                           description={"Он будет использован для входа"} {...register("login")}
                           error={errors.login?.message}/>
                <TextInput label={"Пароль"} type={"password"}
                           placeholder={"Ввведите ваш пароль"} {...register("password")}
                           error={errors.password?.message}/>
                <TextInput label={"Подтвердите пароль"} type={"password"}
                           placeholder={"Подтвердите ваш пароль"} {...register("confirmPassword")}
                           error={errors.confirmPassword?.message}/>

                <Flex justify={"space-between"} align={"center"} mt={20}>
                    <Button variant={"subtle"} color={"red"} onClick={close}>Отмена</Button>
                    <Button onClick={handleSubmit(onSubmit)} loading={isPending}>Продолжить</Button>
                </Flex>
            </Stack>
        </Modal>
    </>
}