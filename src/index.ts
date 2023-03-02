import "./styles.css";
import { switchMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Observable, Observer, timeInterval, interval, of, catchError } from "rxjs";

let image = document.getElementById("dogImage") as HTMLImageElement

const dogObeservable$: Observable<any> =
    fromFetch("https://shibe.online/api/shibes?count=100").pipe(
        switchMap((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return of({ error: true, message: `Error ${response.status}` });
            }
        }),
        catchError(err => {
            console.error(err);
            return of({ error: true, message: err.message })
        })
    );

const dogObserver: Observer<JSON> = {
    next: function (value: JSON): void {
        image.src = value[0];
        showDogsWithInterval(value, 5000);
    },
    error: function (err: any): void {
        console.log(err);
    },
    complete: function (): void {
        console.log("dogObserver completed");
    }
};

dogObeservable$.subscribe(dogObserver);

function showDogsWithInterval(dogJSON: JSON, dogInterval: number) {
    let intervalbetweenDogs = interval(dogInterval);
    let dogiterator = 1
    intervalbetweenDogs.pipe(timeInterval()).subscribe(value => {
        image.src = dogJSON[dogiterator];
        dogiterator++;
    });
}