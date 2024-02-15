"use client";
import {PageHeader} from "@/components/pages/PageHeader";
import {Button, Flex, Grid, Loader, Pagination, Select, TextInput} from "@mantine/core";
import {Plus, Search} from "lucide-react";
import React, {useState} from "react";
import CodeCard from "@/components/admin/invites/CodeCard";
import {useUser} from "@/stores/User";
import {useCanEnter} from "@/utils/access-control/access-redirect";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {InviteCode} from "@/types/invite-codes/invite-code";
import MutateModal from "@/components/admin/invites/MutateModal";
import {useInputState} from "@mantine/hooks";

export default function Page() {
    const [value, setValue] = useInputState("");
    const [status, setStatus] = useInputState("");

    const {can, user} = useUser()


    useCanEnter("admin.invites.read")


    const {data, isLoading} = useQuery({
        queryKey: ["admin-invites"],
        queryFn: async () => await axios.get<InviteCode[]>("/api/admin/invites")
    })

    const [page, setPage] = useState(1)


    return (
        <>
            <div>
                <Flex justify={"space-between"} align={"end"}>
                    <PageHeader>Коды приглашения</PageHeader>
                    {can("admin.invites.create") &&
                        <MutateModal><Button variant={"subtle"} leftSection={<Plus/>}>Создать</Button></MutateModal>}
                </Flex>
                <Flex align={"center"} gap={10}>

                    <TextInput mt={20} w={"100%"} placeholder={"Поиск"} value={value}
                               onChange={setValue} leftSection={<Search/>}/>
                    <Select defaultValue={""} value={status} onChange={setStatus} placeholder={"Статус"} data={[
                        {
                            label: "Все",
                            value: ""
                        },
                        {
                            label: "Активирован",
                            value: "used"
                        }, {
                            label: "Не активирован",
                            value: "unused"
                        }
                    ]} mt={20}/>

                </Flex>
                <Grid columns={3} mt={20}>
                    {isLoading ? <Flex justify={"center"}
                                       w={"100%"}><Loader/></Flex> : data?.data
                        .filter(
                            el => el.code.toLowerCase().includes(value.toLowerCase())
                                || el.activated?.name.toLowerCase().includes(value.toLowerCase())
                        )
                        .filter((el) =>
                            el.status === status || status === ""
                        )
                        .slice((page - 1) * 10, page * 10)
                        .map(el =>
                            <Grid.Col
                                key={el.id} span={{
                                base: 3,
                                md: 1
                            }}><CodeCard code={el}/></Grid.Col>)}
                </Grid>
                <Flex justify={"center"} w={"100%"} mt={20}>
                    <Pagination total={data?.data.length && Math.ceil(data.data.filter(
                        el => el.code.toLowerCase().includes(value.toLowerCase())
                            || el.activated?.name.toLowerCase().includes(value.toLowerCase())
                    )
                        .filter((el) =>
                            el.status === status || status === ""
                        ).length / 10) || 1} value={page} onChange={setPage} size={"sm"}/>
                </Flex>
            </div>
        </>
    )
}