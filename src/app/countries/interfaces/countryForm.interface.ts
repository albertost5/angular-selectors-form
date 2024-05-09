import { FormControl } from '@angular/forms';

export interface CountryFormInterface {
  region: FormControl<string | null>;
  country: FormControl<string | null>;
  borders: FormControl<string | null>;
}
