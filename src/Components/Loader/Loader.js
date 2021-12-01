import classes from './Loader.module.css';

export default function Loader(){
    return (
        <div className={classes.container}>
            <div className={classes.loader}></div>
        </div>
    );
}