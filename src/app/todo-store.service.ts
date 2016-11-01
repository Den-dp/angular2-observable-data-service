import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {List} from 'immutable';
import {Todo} from './todo';
import {TodoBackendService} from './todo-backend.service';
import {asObservable} from './asObservable';

@Injectable()
export class TodoStoreService {
  private _todos: BehaviorSubject<List<Todo>> = new BehaviorSubject(List([]));

  constructor(private todoBackendService: TodoBackendService) {
    this.loadInitialData();
  }

  // todos: Observable<List<Todo>> = this._todos.asObservable();
  // or lazy?
  get todos() {
    return asObservable(this._todos);
  }

  loadInitialData() {
    this.todoBackendService.getAllTodos()
      .subscribe(
        res => {
          let todos = (<Object[]>res.json())
              .map(({id, description, completed}: any) => new Todo({id, description, completed}));

          this._todos.next(List(todos));
        },
        err => console.log(`Error retrieving Todos`)
      );
  }

  addTodo(newTodo:Todo) {
    let observable = this.todoBackendService.saveTodo(newTodo);

    observable.subscribe(res => this._todos.next(this._todos.getValue().push(newTodo)));

    return observable;
  }

  toggleTodo(toggled:Todo) {
    let observable = this.todoBackendService.toggleTodo(toggled);

    observable.subscribe(res => {
      let todos = this._todos.getValue();
      let index = todos.findIndex((todo: Todo) => todo.id === toggled.id);
      let todo:Todo = todos.get(index); // ?
      this._todos.next(todos.set(index, new Todo({id: toggled.id, description: toggled.description, completed: !toggled.completed})));
    });

    return observable;
  }

  deleteTodo(deleted:Todo) {
    let observable = this.todoBackendService.deleteTodo(deleted);

    observable.subscribe(res => {
      let todos: List<Todo> = this._todos.getValue();
      let index = todos.findIndex(todo => todo.id === deleted.id);
      this._todos.next(todos.delete(index));
    });

    return observable;
  }

}
