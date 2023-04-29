import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';

import SearchGallery from '@components/SearchGallery';

const DEFAULT_KEYWORDS = 'baby plushy fuzzy fluffy furry'.split(' ');

export default function Home({imagePath}) {
    return ( <SearchGallery  imagePath={imagePath} searchParams={{keywords: DEFAULT_KEYWORDS}} />)
}

export async function getServerSideProps(context) {
    return {
        props: {imagePath: process.env.IMAGE_PATH}, // will be passed to the page component as props
    }
}
