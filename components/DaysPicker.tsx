import * as React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { DayModifiers } from 'react-day-picker/types/common';

interface DaysPickerProps {
  onClickDay: (days: Date[]) => void;
  selectedDays: Date[];
}

export default function DaysPicker(props: DaysPickerProps) {
  const handleDayClick = (day: Date, { selected }: DayModifiers) => {
    const newSelectedDays = [...props.selectedDays];
    if (selected) {
      const selectedIndex = props.selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      newSelectedDays.splice(selectedIndex, 1);
    } else {
      newSelectedDays.push(day);
    }
    props.onClickDay(newSelectedDays);
  };

  return (
    <div>
      <DayPicker
        selectedDays={props.selectedDays}
        onDayClick={handleDayClick}
      />
    </div>
  );
}
