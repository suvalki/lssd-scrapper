"use client";
import {ActionIcon, Button, Flex, Group, Loader, Stack, Tabs, Text} from "@mantine/core";
import {PageHeader} from "@/components/pages/PageHeader";
import ButtonsSideBar from "@/components/templates/create-page/ButtonsSideBar";
import WorkZone from "@/components/templates/create-page/WorkZone";
import {Save, Trash} from "lucide-react";
import TemplateSetting from "@/blocks/forms/templates-forms/TemplateSetting";
import {useFormState} from "@/stores/FormState";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosResponse} from "axios";
import {Template} from "@/types/templates/template";
import {useParams, useRouter} from "next/navigation";
import {notifications} from "@mantine/notifications";
import {useEffect} from "react";
import {modals, openConfirmModal} from "@mantine/modals";


export default function Page({params: {id}}: { params: { id: string } }) {
    const {templateSettings, init, clear} = useFormState()

    const {data, isLoading, isError} = useQuery({
        queryKey: [`template-${id}`],
        queryFn: async () => await axios.get<Template>(`/api/templates/${id}`),
        enabled: id != "new",
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1
    })

    const router = useRouter()

    useEffect(() => {
        if (id && id != "new" && isError) {
            if (typeof window !== "undefined") {
                router.push("/templates")
            }
        }
        else if (id && id != "new" && data) {
            // @ts-ignore
            init(JSON.parse(data.data.elements), {
                name: data.data.name,
                code: data.data.code,
                description: data.data.description,
                forAll: data.data.forAll
            })
        }
    }, [isLoading, data])


    useEffect(() => {
        if (id == "new") {
            clear()
        }
    }, [id])

    return (<>
            {id != "new" && isLoading && !data ? <Flex justify={"center"} w={"100%"} mt={20}><Loader/></Flex> :
                <>
                    <Flex mb={20} justify={"space-between"} align={"baseline"}>
                        <Stack gap={2}>
                            <PageHeader>{id == "new" ? "Создание шаблона" : "Редактирование шаблона"}</PageHeader>
                            <Text opacity={0.5}>{templateSettings.name}</Text>
                        </Stack>
                        <Group gap={20}>
                            {id != "new" && <DeleteButton/>}
                            <SaveButton/>
                        </Group>

                    </Flex>
                    <Tabs defaultValue={"form"}>
                        <Tabs.List>
                            <Tabs.Tab value={"form"}>Конструктор форм</Tabs.Tab>
                            <Tabs.Tab value={"settings"}>Настройки</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value={"form"}>
                            <Flex w={"100%"} gap={20} mt={20}>

                                <div style={{
                                    width: "100%",
                                }}>
                                    <WorkZone/>
                                </div>

                                <ButtonsSideBar/>
                            </Flex>
                        </Tabs.Panel>
                        <Tabs.Panel value={"settings"} mt={20}>
                            <TemplateSetting/>
                        </Tabs.Panel>
                    </Tabs>
                </>
            }
        </>
    )
}

function SaveButton() {
    const {templateSettings, elements} = useFormState()

    const {id} = useParams<{ id: string }>()

    const queryClient = useQueryClient();

    const router = useRouter()

    const {mutate, isPending} = useMutation({
        mutationKey: [`save-template-${id}`],
        mutationFn: async () => {
            if (id == "new") return await axios.post<Template>(`/api/templates/`, {
                name: templateSettings.name,
                code: templateSettings.code,
                description: templateSettings.description,
                elements: JSON.stringify(elements),
                forAll: templateSettings.forAll
            })
            else {
                return await axios.put<Template>(`/api/templates/${id}`, {
                    name: templateSettings.name,
                    code: templateSettings.code,
                    description: templateSettings.description,
                    elements: JSON.stringify(elements),
                    forAll: templateSettings.forAll
                })
            }
        },
        onSuccess: (data) => {
            notifications.show({
                title: "Успешно",
                message: "Шаблон сохранен",
                color: "green"
            })
            queryClient.invalidateQueries({
                queryKey: ["me"],
            })
            queryClient.invalidateQueries({
                queryKey: [`template-${data.data.id}`],
            })
            if (typeof window !== "undefined") {
                router.push(`/templates/${data.data.id}`)
            }

        },
    })

    return (<>
        <Button variant={"subtle"} leftSection={<Save/>} loading={isPending}
                disabled={!(templateSettings.name.length > 0) && !(templateSettings.code.length > 0)}
                onClick={() => mutate()}>Сохранить</Button>
    </>)
}

function DeleteButton() {

    const {clear} = useFormState()

    const {id} = useParams<{ id: string }>()

    const queryClient = useQueryClient();

    const router = useRouter()

    const {mutate, isPending} = useMutation({
        mutationKey: [`delete-template-${id}`],
        mutationFn: async () => {
            if (id == "new") return
            await axios.delete(`/api/templates/${id}`)
        },
        onSuccess: () => {
            notifications.show({
                title: "Успешно",
                message: "Шаблон удален",
                color: "green"
            })
            queryClient.invalidateQueries({
                queryKey: ["me"],
            })
            if (typeof window !== "undefined") {
                router.push("/templates")
            }
            clear()
        },
    })

    const showConfirmation = () => modals.openConfirmModal({
        title: "Подтвердите действие",
        centered: true,
        children: <Text>Вы уверены, что хотите удалить этот шаблон?</Text>,
        labels: {confirm: "Удалить", cancel: "Отмена"},
        confirmProps: {color: "red"},
        onConfirm: () => mutate()
    })


    return (<><ActionIcon onClick={() => showConfirmation()} loading={isPending} color={"red"} variant={"subtle"}><Trash/></ActionIcon></>)
}