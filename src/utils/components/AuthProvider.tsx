import {deleteCookie, getCookie, hasCookie} from "cookies-next";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {redirect, useRouter} from "next/navigation";
import {Flex, Loader} from "@mantine/core";
import {useUser} from "@/stores/User";
import {User} from "@/types/users/user";
import {Suspense, useEffect} from "react";

export default function AuthProvider({children}: { children: React.ReactNode }) {

    const router = useRouter()
    const {login, user} = useUser()

    const {data, isSuccess, isLoading} = useQuery({
        queryKey: ["me"],
        queryFn: async () => await axios.get<User>("/api/me"),
        enabled: hasCookie("token"),
        retry: 2,

    })

    useEffect(() => {
        if (data && isSuccess) {
            login(data.data)
        }
    }, [data, isSuccess, isLoading])

    if (!isSuccess && !isLoading) {
        deleteCookie("token")
        if (typeof window !== 'undefined') {
            router.push('/login')
        }
    }


    return (
        <div>
            <Suspense>
            <>{isSuccess && !isLoading && data && user ? children :
                <Flex align={"center"} justify={"center"} h={"100vh"}>
                    <Loader/>
                </Flex>
            }</>
            </Suspense>
        </div>
    )
}