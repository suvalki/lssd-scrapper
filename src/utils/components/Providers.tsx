"use client";
import React from "react"
import {createTheme, MantineProvider} from "@mantine/core";

import '@mantine/core/styles.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const theme = createTheme({

    primaryColor: "green",
    colors: {
        green: ["#9FFF40", "#84FF09", "#76ED00", "#69D100", "#5BB600", "#4D9B00", "#408000", "#3B7600", "#376D00", "#326400"],

    }
})
export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme} defaultColorScheme={"dark"}>
                    {children}
                </MantineProvider>
            </QueryClientProvider>
        </>
    )
}