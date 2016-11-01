import {Subject, Observable} from 'rxjs';
export function asObservable(subject: Subject){
    return new Observable(fn => subject.subscribe(fn));
}
