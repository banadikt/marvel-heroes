import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Hero} from "../models/hero";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private readonly LOCAL_STORAGE_KEY = 'marvel-heroes';
  private readonly jsonPath = 'assets/data/marvel_heroes_data.json';
  private heroes = new BehaviorSubject<Hero[]>([]);

  constructor(private http: HttpClient) {
    this.initialiseHeroes();
  }

  initialiseHeroes() {
    const storedHeroes = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (storedHeroes) {
      this.heroes.next(JSON.parse(storedHeroes))
    } else {
      this.loadHeroesData();
    }
  }

  loadHeroesData() {
    this.http.get<Hero[]>(this.jsonPath).pipe(
      map((heroes: Hero[]) => heroes.map((hero, index) => ({
        ...hero,
        id: index + 1
      }))),
      catchError(error => {
        console.log('Error loading Heroes data: ', error);
        return of([]);
      })
    ).subscribe(heroesWithIds => {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(heroesWithIds));
      this.heroes.next(heroesWithIds);
    });
  }

  getHeroes(): Observable<Hero[]> {
    return this.heroes.asObservable();
  }
}
