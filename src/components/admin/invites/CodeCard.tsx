import {ActionIcon, Card, Code, Flex, Group, HoverCard, Menu, MenuDropdown, Text, ThemeIcon} from "@mantine/core";
import {Check, Clock, MoreVertical} from "lucide-react";
import {notifications} from "@mantine/notifications";
import {InviteCode} from "@/types/invite-codes/invite-code";
import {copyMessage} from "@/utils/notifications/copy-notification";
import {useUser} from "@/stores/User";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {modals} from "@mantine/modals";

export default function CodeCard({code}: { code: InviteCode }) {

    const {can} = useUser()

    const queryClient = useQueryClient()

    const statuses = {
        used: {
            icon: <Check/>,
            color: "green",
            closed: false
        },
        unused: {
            icon: <Clock/>,
            color: "orange",
            closed: true
        }
    }


    const {mutate} = useMutation({
        mutationKey: [`admin-invites-delete-${code.id}`],
        mutationFn: async () => await axios.delete(`/api/admin/invites/`, {
            data: {
                id: code.id
            }
        }),
        onSuccess: () => {
            notifications.show({
                title: "Успешно",
                message: "Код приглашения удален",
                color: "green",
            })
            queryClient.invalidateQueries({
                queryKey: ["admin-invites"]
            })
        }
    })

    const openConfirmModal = () => modals.openConfirmModal({
        title: "Удаление кода приглашения",
        centered: true,
        children: (
            <Text>
                Вы уверены, что хотите удалить этот код приглашения?
            </Text>
        ),
        labels: {confirm: "Удалить", cancel: "Отмена"},
        confirmProps: {color: "red"},
        onConfirm: () => mutate()
    })

    return (
        <div>
            <Card>
                <Flex justify={"space-between"} align={"center"} gap={0}>
                    <Flex align={"center"} gap={10}>
                        <HoverCard disabled={!code.activated}>
                            <HoverCard.Target>
                                <ThemeIcon color={statuses[code.status as keyof typeof statuses].color} mb={0}
                                           variant={"transparent"}>
                                    {statuses[code.status as keyof typeof statuses].icon}
                                </ThemeIcon>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                {code.activated ? `Активирован ${code.activated.name}` : "Не активирован"}
                            </HoverCard.Dropdown>
                        </HoverCard>
                            <Code onClick={() => {
                                navigator.clipboard.writeText(code.code)
                                copyMessage()
                            }} style={{
                                cursor: "pointer"
                            }}>
                                {statuses[code.status as keyof typeof statuses].closed ? Array.from(code.code).map((c) => c == "-" ? c : "•") : code.code}
                            </Code>

                    </Flex>
                    {can("admin.invites.delete") &&
                        <Menu>
                            <Menu.Target>

                                <ActionIcon variant={"transparent"} color={"gray"}>
                                    <MoreVertical/>
                                </ActionIcon>
                            </Menu.Target>
                            <MenuDropdown>
                                <Menu.Label>Роль: {code.role.name}</Menu.Label>
                                <Menu.Item onClick={openConfirmModal}>Удалить</Menu.Item>
                            </MenuDropdown>
                        </Menu>
                    }
                </Flex>
            </Card>
        </div>
    )
}