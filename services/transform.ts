import { SelectedDays } from '../reducer';

export interface SelectedStrDays {
  [key: string]: string[];
}

export const parseSelectedDaysFromString = (
  selectedStrDays: SelectedStrDays
): SelectedDays => {
  return Object.keys(selectedStrDays).reduce((days, templateKey) => {
    const dates = selectedStrDays[templateKey].map((s) => new Date(s));
    return { ...days, [templateKey]: dates };
  }, {});
};
