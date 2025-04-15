import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Hero} from "../../core/models/hero";
import {HeroService} from "../../core/services/hero.service";
import {MatSort} from "@angular/material/sort";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatDialog} from "@angular/material/dialog";
import {HeroDetailDialogComponent} from "../hero-detail-dialog/hero-detail-dialog.component";
import {HeroFormDialogComponent} from "../hero-form-dialog/hero-form-dialog.component";

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})

export class HeroesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  readonly separatorKeyCodes = [ENTER, COMMA];
  selectedHeroNames: string[] = [];

  dataSource = new MatTableDataSource<Hero>();
  displayedColumns: (keyof Hero | 'actions' )[] = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'occupationLabel', 'memberOfLabel', 'creatorLabel', 'actions'];

  constructor(
    private heroService: HeroService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.loadHeroes();
    this.setupFilter();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.dataSource.data = heroes;
    })
  }

  setupFilter() {
    this.dataSource.filterPredicate = (hero: Hero) => {
      if (this.selectedHeroNames.length === 0) {
        return true;
      }

      return this.selectedHeroNames.includes(hero.nameLabel.toLowerCase());
    }

  }

  addChip(event: MatChipInputEvent) {
    const value = (event.value || '').trim().toLowerCase();

    if (value && !this.selectedHeroNames.includes(value)) {
      this.selectedHeroNames.push(value);
      this.dataSource.filter = Math.random().toString();
    }

    event.chipInput.clear();
  }

  removeChip(name: string) {
    const index = this.selectedHeroNames.indexOf(name);

    if (index >= 0) {
      this.selectedHeroNames.splice(index, 1);
      this.dataSource.filter = Math.random().toString();
    }
  }

  openViewDialog(hero: Hero): void {
    this.dialog.open(HeroDetailDialogComponent, { data: hero })
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(HeroFormDialogComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.addHero(result);
        this.loadHeroes();
      }
    })
  }

  openEditDialog(hero: Hero): void {
    const dialogRef = this.dialog.open(HeroFormDialogComponent, { data: { hero: hero } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.editHero({...hero, ...result});
        this.loadHeroes();
      }
    })
  }

  deleteHero(heroId: number): void {
    this.heroService.deleteHero(heroId);
    this.loadHeroes();
  }

  getLabels(column: keyof Hero | 'actions'): string[] {
    if (column === 'actions') {
      return [];
    }
    const values = this.dataSource.data.map(hero => hero[column] as string);
    return Array.from(new Set(values));
  }

  getCount(column: keyof Hero | 'actions'): number[] {
    if (column === 'actions') {
      return [];
    }
    const values = this.dataSource.data.map(hero => hero[column] as string);
    const labels = this.getLabels(column)
    return labels.map(label => values.filter(value => value === label).length);
  }

  getUniqueCount(column: keyof Hero | 'actions'): number {
    if (column === 'actions') {
      return 0;
    }
    return this.getLabels(column).length;
  }

  getChartData(column: keyof Hero | 'actions'): { name: string, value: number }[] {
    if (column === 'actions') {
      return []
    }
    const labels = this.getLabels(column);
    const counts = this.getCount(column);
    return labels.map((label, index) => ({ name: label, value: counts[index] }));
  }
}
