import '../styles/globals.css'
import Script from 'next/script'

import type { AppProps } from 'next/app'
const gaTag = process.env.NEXT_PUBLIC_GA_TRACKING_ID
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            {gaTag && <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaTag}`} /> }
            {gaTag && <Script id='google-analytics' strategy="afterInteractive" dangerouslySetInnerHTML={{
                            __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaTag}');
                            `,
                            }}
                    />}
            <Component {...pageProps} />
        </>
    )
}
export default MyApp
