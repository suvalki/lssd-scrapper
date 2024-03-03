import {User} from "@/types/users/user";
import {Answer} from "@/types/topics/answer";

export type Topic = {
    id: number
    url: string,
    topicId: number,
    pages: number,
    answers: number,
    forumUserCreated: string,
    name: string,
    topicAnswers: Answer[],
    createdAt: string
}