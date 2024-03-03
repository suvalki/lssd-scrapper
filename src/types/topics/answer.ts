import {Topic} from "@/types/topics/topic";

export type Answer = {
    id: number
    topic: Topic
    createdAt: string
    name: string
}