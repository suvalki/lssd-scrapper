import '@mantine/core/styles.css';

import {ColorSchemeScript, createTheme, MantineProvider} from '@mantine/core';
import Providers from "@/utils/components/Providers";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";

export const metadata = {
    title: "Почта",
}

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const queryClient = new QueryClient()
    const theme = createTheme({

        primaryColor: "green",
        colors: {
            green: ["#9FFF40", "#84FF09", "#76ED00", "#69D100", "#5BB600", "#4D9B00", "#408000", "#3B7600", "#376D00", "#326400"],

        }
    })

    return (
        <html lang="en">

        <body>
        <ColorSchemeScript/>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} defaultColorScheme={"dark"}>
                {children}
            </MantineProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}