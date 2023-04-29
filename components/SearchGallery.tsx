import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';

import 'photoswipe/dist/photoswipe.css'
import { debounce } from '@lib/utils'

import { Gallery, Item } from 'react-photoswipe-gallery'

const PAGE_SIZE = 100

export default function SearchGallery({searchParams, imagePath}) {
    const router = useRouter();
    const {prompt} = router.query;

    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState([])
    const [offset, setOffset] = useState(0)

    const handleScroll = () => {
        if ((window.innerHeight*2 + window.scrollY) > document.body.offsetHeight) {
            setOffset(offset + PAGE_SIZE);
        }
    }

    useEffect(() => {
        if (offset > images.length) {
            return
        }
        setLoading(true)
        const params = {size: PAGE_SIZE, offset, ...searchParams}
        if (prompt) {
            params['prompt'] = prompt
        }
        fetch('/api/search?' + new URLSearchParams(params))
        .then((res) => res.json())
        .then((data) => {
            setImages([...images, ...data.hits.hits.map((hit) => ({
                src: hit._source.image_path.replaceAll(imagePath, '/api/images'),
                width: hit._source.hires_upscale > 1 ? hit._source.size_1 * hit._source.hires_upscale : hit._source.size_1,
                height: hit._source.hires_upscale > 1 ? hit._source.size_2 * hit._source.hires_upscale : hit._source.size_2,
                _source: hit._source
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
        <Gallery
            options={{
                preload: [5, 5]
            }}
            withCaption
        >
            {
                images.map((image:any) => (
                    <Item
                        key={`item-${image.src}`}
                        original={image.src}
                        thumbnail={`${image.src}?width=512`}
                        width={image.width}
                        height={image.height}
                        caption={image._source.prompt}
                    >
                        {({ ref, open }) => (
                            <img ref={ref}
                                onClick={open}
                                key={`img-${image.src}`}
                                src={`${image.src}?width=256`}
                                loading="lazy"
                            />
                        )}
                    </Item>
                ))
            }
        </Gallery>
        {isLoading && <div>Loading...</div>}
    </div>)
}
