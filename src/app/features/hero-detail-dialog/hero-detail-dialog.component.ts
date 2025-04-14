import {Component, Inject} from '@angular/core';
import {Hero} from "../../core/models/hero";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-hero-detail-dialog',
  templateUrl: './hero-detail-dialog.component.html',
  styleUrls: ['./hero-detail-dialog.component.scss']
})
export class HeroDetailDialogComponent {
  heroPropertyKeys = [
    "nameLabel",
    "genderLabel",
    "citizenshipLabel",
    "skillsLabel",
    "occupationLabel",
    "memberOfLabel",
    "creatorLabel"
  ];

  constructor(
    public dialogRef: MatDialogRef<HeroDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hero
  ) {
  }

}
