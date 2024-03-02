import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface'
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {
  constructor(private http: HttpClient) { }

  private baseUrl: string = environments.baseUrl

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id:string): Observable<Hero|undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      catchError( error => of(undefined) )
      //? of de rxjs es una forma de crear observables basado en el valor en sus parentecis
    )
  }

  getSuggestions(query :string ):Observable<Hero[]> {     //? endpoint
      return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);

  }

}
