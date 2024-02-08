"use client";
import React, {HTMLAttributes} from "react"
import {Avatar, Flex, Menu} from "@mantine/core";
import {ChevronLeft} from "lucide-react";

export const UserMenu: React.FC<HTMLAttributes<HTMLDivElement>> = ({...props}) => {
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
                    <span>Admin</span>
                    <Avatar>A</Avatar>
                </Flex>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Профиль Admin</Menu.Label>
                <Menu.Divider/>
                <Menu.Label>Форумный аккаунт</Menu.Label>
                <Menu.Item leftSection={<ChevronLeft size={20}/>}>Test Account</Menu.Item>
                <Menu.Divider/>
                <Menu.Item>Настройки</Menu.Item>
                <Menu.Item>Выйти</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>
}