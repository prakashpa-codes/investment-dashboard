/**
 * Investment Dashboard POC
 * Author: Prakash Pa
 * License: MIT
 * Created: 2025
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { importProvidersFrom } from '@angular/core';

// Define US Date Format (MM/DD/YYYY)
const US_DATE_FORMATS = {
  parse: { dateInput: 'MM/dd/yyyy' },
  display: {
    dateInput: 'MM/dd/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'MM/dd/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(MatDialogModule),
    MatNativeDateModule,
    MatDatepickerModule,
    DatePipe,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: US_DATE_FORMATS }
  ]
}).catch((err) => console.error(err));
