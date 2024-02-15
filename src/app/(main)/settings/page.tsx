"use client";
import {Button, Flex, Grid} from "@mantine/core";
import {PageHeader} from "@/components/pages/PageHeader";
import ChangePasswordForm from "@/blocks/forms/settings-forms/ChangePasswordForm";
import ForumAccountsForm from "@/blocks/forms/settings-forms/ForumAccountsForm";
import {Key, NewspaperIcon, Plus, UserIcon, Users2} from "lucide-react";
import InfoCard from "@/blocks/cards/settings/InfoCard";
import {useUser} from "@/stores/User";
import {useMediaQuery} from "@mantine/hooks";

export default function Page() {

    const {user} = useUser()

    const match = useMediaQuery("(max-width: 992px)")

    return (
        <>
            <Flex mb={20}>
                <PageHeader>Настройки</PageHeader>
            </Flex>
            <Flex gap={20} direction={match ? "column" : "row"}>
                <InfoCard value={user?.activeInvite?.created?.name} title={"Приглашен"} icon={<Key/>}/>
                <InfoCard value={user?.role.name} title={"Роль"} icon={<UserIcon/>}/>
                <InfoCard value={user?.forumAccounts.length} title={"Аккаунтов"} icon={<Users2/>}/>
                <InfoCard value={user?.templatesCreated.length} title={"Шаблонов"} icon={<NewspaperIcon/>}/>
            </Flex>
            <Grid columns={2} mt={20}>
                <Grid.Col span={{
                    base: 2,
                    md: 1,

                }}><ChangePasswordForm/></Grid.Col>
                <Grid.Col span={{
                    base: 2,
                    md: 1,

                }}><ForumAccountsForm/></Grid.Col>
            </Grid>
        </>
    );
}