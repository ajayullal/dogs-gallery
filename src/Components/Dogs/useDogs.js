import { useState, useEffect, useRef } from 'react';
import axios from "axios";

const BREEDS_ENDPOINT = "https://dog.ceo/api/breeds/list/all";

export default function useDogs(lastDogRef) {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const dogsRef = useRef({
        totalDogs: 0,
        loaded: 0
    });

    const lastElementObserver = useRef();

    const hasDogs = () => dogsRef.current.loaded < dogsRef.current.totalDogs;

    const fetchDogs = () => {
        setLoading(true);

        const dogsData = dogsRef.current.breeds.slice(dogsRef.current.loaded, dogsRef.current.loaded + 12).map(breed => {
            return axios.get(`https://dog.ceo/api/breed/${breed}/images`).then(resp => {
                return {
                    breed,
                    imgSrc: resp.data.message[0]
                };
            });
        });

        Promise.all(dogsData).then(dogs => {
            setDogs(_dogs => [..._dogs, ...dogs]);
            dogsRef.current.loaded += dogs.length;
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        const fetchBreeds = async () => {
            setLoading(true);
            const response = await axios.get(BREEDS_ENDPOINT);
            const breeds = Object.keys(response.data.message);
            dogsRef.current.breeds = breeds;
            dogsRef.current.totalDogs = breeds.length;
            if (hasDogs()) {
                fetchDogs();
            }
            setLoading(false);
        };

        fetchBreeds();
    }, []);

    const setLastDogObserver = (lastDogNode) => {
        if(loading) return;

        if (lastDogNode) {
            lastElementObserver.current?.disconnect();

            lastElementObserver.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    if (hasDogs()) {
                        fetchDogs();
                    }
                }
            });

            lastElementObserver.current.observe(lastDogNode);
        }
    };

    return {
        dogs,
        loading,
        setLastDogObserver
    };
}