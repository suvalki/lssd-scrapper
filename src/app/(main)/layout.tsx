"use client";
import {MainNavbar} from "@/components/navigation/public/MainNavbar";
import {Container} from "@mantine/core";
import AuthProvider from "@/utils/components/AuthProvider";
import {Suspense} from "react";
import Loading1 from "@/app/loading1";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div>
                <AuthProvider>
                    <MainNavbar/>
                    <Container>{children}</Container>
                </AuthProvider>
        </div>
    )
}