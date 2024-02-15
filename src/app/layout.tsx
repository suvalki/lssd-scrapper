"use client";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import {ColorSchemeScript, createTheme, MantineProvider} from '@mantine/core';
import Providers from "@/utils/components/Providers";
import React from "react";
import {Notifications} from "@mantine/notifications";


export default async function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const theme = createTheme({

        primaryColor: "green",
        colors: {
            green: ["#9FFF40", "#84FF09", "#76ED00", "#69D100", "#5BB600", "#4D9B00", "#408000", "#3B7600", "#376D00", "#326400"],

        }
    })

    return (
        <html lang="en">
        <head>
            <title>Почта</title>
        </head>
        <body>
        <ColorSchemeScript defaultColorScheme={"dark"}/>
            <MantineProvider theme={theme} defaultColorScheme={"dark"}>

                <Notifications/>
                <Providers>{children}</Providers>
            </MantineProvider>
        </body>
        </html>
    );
}