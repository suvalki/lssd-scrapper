"use client";
import React from "react"
import {Burger, Container, Flex, Menu, VisuallyHidden} from "@mantine/core";
import {Mail} from "lucide-react";
import {NavigationLink} from "@/components/navigation/helpers/NavigationLink";
import {UserMenu} from "@/components/navigation/helpers/UserMenu";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "@/stores/User";


export const MainNavbar: React.FC = () => {

    const pathName = usePathname()

    const match = useMediaQuery("( max-width: 992px )");

    const {can} = useUser()

    const menuItems = {
        send: "Отправить письмо",
        templates: "Мои шаблоны",
        admin: "Админ-панель"
    }

    return (
        <>
            <Container>
                <Flex justify={"space-between"} align={"center"}>
                    <Flex style={{
                        color: "var(--mantine-color-green-6)",
                    }}
                          align={"center"}
                          gap={"0.5rem"}
                    mt={"-0.5rem"}>
                        <Mail size={25}/>
                        <h3>Почта</h3>
                    </Flex>
                    {!match && <Flex

                        align={"flex-end"}
                        gap={"0.5rem"}
                    >
                        {Object.entries(menuItems).map(([key, value]) => (
                            can(`${key}.access`) && <NavigationLink key={key} title={value} link={`/${key}`} active={pathName.includes(`/${key}`)}/>
                        ))}
                    </Flex>}

                    <UserMenu/>

                    {match && <Menu>
                        <Menu.Target>
                            <Burger />
                        </Menu.Target>
                        <Menu.Dropdown>

                            {Object.entries(menuItems).map(([key, value]) => (
                                <Menu.Item key={key} component="a" href={`/${key}`}>
                                    {value}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>}
                </Flex>
            </Container>
        </>
    )
}