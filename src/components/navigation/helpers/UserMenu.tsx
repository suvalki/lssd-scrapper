"use client";
import React, {HTMLAttributes} from "react"
import {ActionIcon, Avatar, Flex, Menu} from "@mantine/core";
import {Check} from "lucide-react";
import {useRouter} from "next/navigation";
import {useUser} from "@/stores/User";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {deleteCookie} from "cookies-next";

export const UserMenu: React.FC<HTMLAttributes<HTMLDivElement>> = ({...props}) => {

    const router = useRouter()

    const {user, logout} = useUser()

    const queryClient = useQueryClient()

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

    return <>
        {/*@ts-ignore*/}
        <Menu {...props}>
            <Menu.Target>
                <Flex
                    align={"center"}
                    gap={"0.5rem"}
                    style={{
                        cursor: "pointer",
                    }}>
                    <span>{user?.name}</span>
                    <Avatar>A</Avatar>
                </Flex>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Профиль Admin</Menu.Label>
                <Menu.Divider/>
                <Menu.Label>Форумный аккаунт</Menu.Label>
                {user?.forumAccounts?.map(account =>
                    <Menu.Item key={account.id} rightSection={account.active &&
                        <ActionIcon color={"green"} variant={"transparent"} size={"xs"}><Check size={18}/></ActionIcon>}
                               onClick={() => !account.active && switchAccountActive.mutate({id: account.id})}>{account.login}</Menu.Item>
                )}

                <Menu.Divider/>
                <Menu.Item onClick={() => router.push("/settings")}>Настройки</Menu.Item>
                <Menu.Item onClick={() => {
                    deleteCookie("token")
                    logout()
                    router.push("/")
                }}>Выйти</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>
}