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

  addHero(newHero: Hero): void {
    const currentHeroes = this.heroes.value;
    const newId = currentHeroes.length > 0
      ? Math.max(...currentHeroes.map(h => h.id!)) + 1
      : 1;

    const heroWithId = { ...newHero, id: newId };
    const updatedHeroes = [ heroWithId, ...currentHeroes];

    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroes));
    this.heroes.next(updatedHeroes);
  }

  editHero(updatedHero: Hero): void {
    const currentHeroes = this.heroes.value;
    const index = currentHeroes.findIndex(hero => hero.id! === updatedHero.id);

    if (index !== -1) {
      currentHeroes[index] = updatedHero;
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(currentHeroes));
      this.heroes.next([...currentHeroes]);
    }
  }

  deleteHero(heroId: number): void {
    const currentHeroes = this.heroes.value;
    const updatedHeroes = currentHeroes.filter(hero => hero.id! !== heroId);

    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroes));
    this.heroes.next(updatedHeroes);

  }
}
