"use client";
import {useRouter} from "next/navigation";
import {useUser} from "@/stores/User";

export const useCanEnter = (name: string, func?: () => any) => {

    const {can, user} = useUser()
    const router = useRouter()

    if (func) {
        if (can(name) && user) {
            return func()
        }
        else {
            router.push("/")
        }
    }
    else {
        if (!can(name) && user) {
            router.push("/")
        }
    }
}