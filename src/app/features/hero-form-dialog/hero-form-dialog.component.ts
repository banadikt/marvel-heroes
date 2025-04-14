import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Hero} from "../../core/models/hero";

@Component({
  selector: 'app-hero-form-dialog',
  templateUrl: './hero-form-dialog.component.html',
  styleUrls: ['./hero-form-dialog.component.scss']
})
export class HeroFormDialogComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HeroFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hero?: Hero },
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameLabel: [this.data.hero?.nameLabel || '', Validators.required],
      genderLabel: [this.data.hero?.genderLabel || '', Validators.required],
      citizenshipLabel: [this.data.hero?.citizenshipLabel || '', Validators.required],
      skillsLabel: [this.data.hero?.skillsLabel || '', Validators.required],
      occupationLabel: [this.data.hero?.occupationLabel || '', Validators.required],
      memberOfLabel: [this.data.hero?.memberOfLabel || '', Validators.required],
      creatorLabel: [this.data.hero?.creatorLabel || '', Validators.required]
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}
