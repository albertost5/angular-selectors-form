import { Injectable } from '@angular/core';
import { Country, Region } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { SmallCountry } from '../interfaces/smallCountry.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _regions: Region[] = [
    Region.Europe,
    Region.Africa,
    Region.Americas,
    Region.Oceania,
    Region.Asia,
  ];

  private basePath: string = 'https://restcountries.com/v3.1/region';

  constructor(private readonly http: HttpClient) {}

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<SmallCountry[]> {
    if (!region) return of([]);
    const url: string = `${this.basePath}/${region}?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url).pipe(
      map((countries) =>
        countries.map(({ name, cca3, borders }) => ({
          name: name.common,
          cca3: cca3,
          borders: borders ?? [],
        })),
      ),
    );
  }
}
