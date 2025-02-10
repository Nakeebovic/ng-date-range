# Angular Date Range Picker

A flexible, standalone Angular date range picker component with built-in support for RTL languages (Arabic/English) and customizable styling.

![npm](https://img.shields.io/npm/v/angular-date-range)
![license](https://img.shields.io/npm/l/angular-date-range)
![Angular](https://img.shields.io/badge/Angular-17.x-red)

## Features

- 📅 Standalone component architecture
- 🌐 Built-in RTL support (Arabic/English)
- 🎨 Customizable styling
- 📱 Responsive design
- 🔄 Two-way data binding
- 🎯 Min/Max date restrictions
- 🧩 Flexible date range selection
- 💫 Smooth animations
- 🎈 Lightweight

## Installation

```bash
npm install date-range-angular-lib @ngx-translate/core
```

## Usage

1. Import the component in your module or standalone component:

```typescript
import { AngularDateRangeComponent } from 'angular-date-range';

@Component({
  // ...
  imports: [AngularDateRangeComponent]
})
```

2. Use it in your template:

```html
<angular-date-range
  [defaultLang]="'en'"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [showLabel]="true"
  [showToDate]="true"
  [initialFromDate]="startDate"
  [initialToDate]="endDate"
  (dateRangeChange)="onDateRangeChange($event)"
  (languageChange)="onLanguageChange($event)"
>
</angular-date-range>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| defaultLang | 'en' \| 'ar' | 'en' | Default language for the date picker |
| minDate | Date | undefined | Minimum selectable date |
| maxDate | Date | undefined | Maximum selectable date |
| showLabel | boolean | true | Show/hide field labels |
| arFromPlacholder | string | undefined | Arabic placeholder for 'from' date |
| enFromPlacholder | string | undefined | English placeholder for 'from' date |
| arToPlacholder | string | undefined | Arabic placeholder for 'to' date |
| enToPlacholder | string | undefined | English placeholder for 'to' date |
| showToDate | boolean | true | Show/hide the 'to' date field |
| initialFromDate | Date \| null | undefined | Initial value for 'from' date |
| initialToDate | Date \| null | undefined | Initial value for 'to' date |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| dateRangeChange | EventEmitter<{fromDate: string \| Date \| null; toDate: string \| Date \| null}> | Emits when date range changes |
| languageChange | EventEmitter<'en' \| 'ar'> | Emits when language changes |

## Example

```typescript
import { Component } from '@angular/core';
import { AngularDateRangeComponent } from 'angular-date-range';

@Component({
  selector: 'app-root',
  template: `
    <angular-date-range
      [minDate]="minDate"
      [maxDate]="maxDate"
      (dateRangeChange)="onDateRangeChange($event)"
    >
    </angular-date-range>
  `,
  standalone: true,
  imports: [AngularDateRangeComponent]
})
export class AppComponent {
  minDate = new Date(2024, 0, 1);
  maxDate = new Date(2024, 11, 31);

  onDateRangeChange(range: { fromDate: string | Date | null; toDate: string | Date | null }) {
    console.log('Date range changed:', range);
  }
}
```

## Styling

The component uses SCSS and can be customized using CSS variables or by overriding the default classes. The main wrapper class is `.calendar-container`.

Example of customizing styles:

```scss
:host ::ng-deep {
  .calendar-container {
    .date-field {
      border-color: #your-color;
    }

    .calendar-day.selected {
      background-color: #your-primary-color;
    }
  }
}
```

## RTL Support

The component automatically handles RTL layouts based on the selected language. When Arabic is selected, the layout switches to RTL mode, including:

- Calendar navigation
- Date selection
- Input field alignment
- Icon positioning

## Translations

The component comes with built-in translations for English and Arabic. You can customize the translations by providing your own translation service:

```typescript
import { translations } from 'angular-date-range';

// Extend or modify the existing translations
const customTranslations = {
  ...translations,
  ar: {
    ...translations.ar,
    fromDate: 'تاريخ البداية',
    // Add more custom translations
  }
};
```

## Requirements

- Angular 17.x or higher
- @ngx-translate/core

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

