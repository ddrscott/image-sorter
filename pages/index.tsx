import {useEffect, useState} from 'react';
import 'photoswipe/dist/photoswipe.css'
import { debounce } from '../lib/utils'

import { Gallery, Item } from 'react-photoswipe-gallery'

const PAGE_SIZE = 100

export default function MyGallery() {
    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState([])
    const [offset, setOffset] = useState(0)

    const handleScroll = () => {
        if ((window.innerHeight*2 + window.scrollY) > document.body.offsetHeight) {
            setOffset(offset + PAGE_SIZE);
        }
    }

    useEffect(() => {
        setLoading(true)
        fetch('/api/search?' + new URLSearchParams({ size: PAGE_SIZE, offset}))
        .then((res) => res.json())
        .then((data) => {
            setImages([...images, ...data.hits.hits.map((hit) => ({
                src: hit._source.image_path.replaceAll('/media/shared/www-data/', 'https://www.dataturd.com/'),
                width: hit._source.size_1,
                height: hit._source.size_2
            }))])
            setLoading(false)
        })
    }, [offset])

    useEffect(() => {
        const fn = debounce(handleScroll);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    });

    return (<div className="responsive-container">
        {isLoading && <div>Loading...</div>}
        <Gallery
            options={{
                preload: [5, 5]
            }}
        >
            {
                images.map((image:any) => (
                    <Item
                        key={image.src}
                        original={image.src}
                        width={image.width}
                        height={image.height}
                    >
                        {({ ref, open }) => (
                            <img ref={ref} onClick={open} loading="lazy" {...image} />
                        )}
                    </Item>
                ))
            }
        </Gallery>
    </div>)
}
