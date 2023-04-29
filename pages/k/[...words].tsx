import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';

import SearchGallery from '@components/SearchGallery'; 

export default function MyGallery({imagePath}) {
    const router = useRouter();
    const { words } = router.query;

    return (
        <>
            <SearchGallery  imagePath={imagePath} searchParams={{keywords: words}}/>
        </>
    )
}
export async function getServerSideProps(context) {
    return {
        props: {imagePath: process.env.IMAGE_PATH}, // will be passed to the page component as props
    }
}
