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
  bordersByCountry: SmallCountry[] = [];
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
    this.onCountryChanged();
  }

  onRegionChanged(): void {
    this.myForm.controls.region.valueChanges
      .pipe(
        skipWhile((val) => val === '' || val === undefined),
        tap(() => this.myForm.controls.country.setValue('')),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region!),
        ),
      )
      .subscribe((countriesByRegion) => {
        this.countriesByRegion = countriesByRegion.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });
  }

  onCountryChanged(): void {
    this.myForm.controls.country.valueChanges
      .pipe(
        skipWhile((val) => val === '' || val === undefined),
        tap(() => this.myForm.controls.borders.reset('')),
        switchMap((countryAlphaCode) =>
          this.countriesService.getBordersByAlphaCode(countryAlphaCode!),
        ),
        switchMap((country) =>
          this.countriesService.getCountryBordersByAlphaCodes(country.borders),
        ),
      )
      .subscribe((countries) => (this.bordersByCountry = countries));
  }
}
