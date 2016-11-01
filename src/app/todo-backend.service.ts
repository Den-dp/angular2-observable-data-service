import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Todo} from './todo';
import {List} from 'immutable';
import {Observable} from 'rxjs';

@Injectable()
export class TodoBackendService {

  constructor(private http: Http) {
  }

  getAllTodos(){
    return this.http.get('/todo');
  }

  saveTodo(newTodo: Todo): Observable<List<Todo>> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf=8');
    return this.http.post('/todo', JSON.stringify(newTodo.toJS()), {headers}).share();
  }

  deleteTodo(deletedTodo: Todo) {
    let params = new URLSearchParams();
    params.append('id', '' + deletedTodo.id);

    return this.http.delete('/todo', {search: params}).share();
  }

  toggleTodo(toggled: Todo){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf=8');
    return this.http.put('/todo', JSON.stringify(toggled.toJS()), {headers}).share();
  }
}
