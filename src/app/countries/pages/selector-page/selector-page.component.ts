import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryFormInterface } from '../../interfaces/countryForm.interface';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interface';
import { filter, skip, skipWhile, switchMap, tap } from 'rxjs';
import { SmallCountry } from '../../interfaces/smallCountry.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  countriesByRegion: SmallCountry[] = [];
  public myForm: FormGroup<CountryFormInterface> = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService,
  ) {}

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  ngOnInit(): void {
    this.onRegionChanged();
  }

  onRegionChanged() {
    this.myForm.controls.region.valueChanges
      .pipe(
        tap(() => this.myForm.controls.country.setValue('')), // reset
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region!),
        ),
      )
      .subscribe((countriesByRegion) => {
        this.countriesByRegion = countriesByRegion;
      });
  }
}
