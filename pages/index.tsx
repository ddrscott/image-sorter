import {useEffect, useState} from 'react';
import 'photoswipe/dist/photoswipe.css'

import { Gallery, Item } from 'react-photoswipe-gallery'

export default function MyGallery() {
    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState([])

    useEffect(() => {
        setLoading(true)
        fetch('/api/gallery')
        .then((res) => res.json())
        .then((data) => {
            setImages(data.gallery)
            setLoading(false)
        })
    }, [])

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
                        original={image.src}
                        thumbnail={image.src + "?width=128"}
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
