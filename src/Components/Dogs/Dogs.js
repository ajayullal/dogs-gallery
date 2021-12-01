import React, { useRef } from 'react';
import Loader from '../Loader/Loader';
import useDogs from './useDogs';
import classes from './Dogs.module.css';

const DogCard = React.forwardRef(({ dog }, ref) => {
    return (
        <figure ref={ref} className={classes.dogCardContainer}>
            <img className={classes.image} src={dog.imgSrc} alt={dog.breed} />
            <figcaption className={classes.imageCaption}>{dog.breed}</figcaption>
        </figure>
    );
});

export default function Dogs() {
    const lastDogRef = useRef();
    const { dogs, loading, setLastDogObserver } = useDogs(lastDogRef.current);

    return (
        <>
            <h1 className={classes.pageHeader}>Dogs Gallery</h1>

            <div className={classes.container}>
                {
                    dogs.map((dog, index) => {
                        if (index === dogs.length - 1) {
                            return <DogCard ref={setLastDogObserver} key={dog.breed} dog={dog}></DogCard>;
                        } else {
                            return <DogCard key={dog.breed} dog={dog}></DogCard>
                        }
                    })
                }
            </div>

            {loading && <Loader></Loader>}
        </>
    );
}