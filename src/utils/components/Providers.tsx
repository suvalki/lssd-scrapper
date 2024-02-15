"use client";
import React from "react"

import '@mantine/core/styles.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ModalsProvider} from "@mantine/modals";


export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ModalsProvider>
                    {children}
                </ModalsProvider>
            </QueryClientProvider>
        </>
    )
}