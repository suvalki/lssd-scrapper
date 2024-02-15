"use client";
import AdminNavbar from "@/components/navigation/public/AdminNavbar";
import {useUser} from "@/stores/User";
import {useRouter} from "next/navigation";
import {useCanEnter} from "@/utils/access-control/access-redirect";

export default function Layout({children}: { children: React.ReactNode }) {

    const {can} = useUser()
    useCanEnter("admin.access")


    return (
        <>
            {can("admin.access") && <>
                <AdminNavbar/>
                {children}
            </>}
        </>
    )
}
