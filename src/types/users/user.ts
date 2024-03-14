import {Role} from "@/types/users/role";
import {Template} from "@/types/templates/template";
import {InviteCode} from "@/types/invite-codes/invite-code";
import {ForumAccount} from "@/types/forum-accounts/forum-account";

export type User = {
    id: number,
    login: string,
    name: string,
    role: Role,
    activeInvite?: InviteCode,
    invitesCreated: InviteCode[],
    templates: Template[],
    forumAccounts: ForumAccount[],
    createdAt: Date
}