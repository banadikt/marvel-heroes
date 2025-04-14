import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Hero} from "../../core/models/hero";
import {HeroService} from "../../core/services/hero.service";

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export class HeroesListComponent implements OnInit {
  dataSource = new MatTableDataSource<Hero>();
  displayedColumns = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'occupationLabel', 'memberOfLabel', 'creatorLabel'];

  constructor(private service: HeroService) { }

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.service.getHeroes().subscribe(heroes => {
      console.log(heroes);
      this.dataSource.data = heroes;
    })
  }
}
