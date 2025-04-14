import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Hero} from "../../core/models/hero";
import {HeroService} from "../../core/services/hero.service";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export class HeroesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Hero>();
  displayedColumns = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'occupationLabel', 'memberOfLabel', 'creatorLabel'];

  constructor(private service: HeroService) { }

  ngOnInit() {
    this.loadHeroes();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadHeroes(): void {
    this.service.getHeroes().subscribe(heroes => {
      this.dataSource.data = heroes;
    })
  }
}
