import '@mantine/core/styles.css';

import {ColorSchemeScript} from '@mantine/core';
import Providers from "@/utils/components/Providers";

export const metadata = {
    title: "Почта",
}

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">

        <body>
        <ColorSchemeScript/>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}