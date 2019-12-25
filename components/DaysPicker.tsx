import * as React from 'react';
import { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { DayModifiers } from 'react-day-picker/types/common';

interface DaysPickerProps {
  onClickDay: (days: Date[]) => void;
}

export default function DaysPicker(props: DaysPickerProps) {
  const [selectedDays, setSelectedDays] = useState([] as Date[]);

  const handleDayClick = (day: Date, { selected }: DayModifiers) => {
    const newSelectedDays = [...selectedDays];
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      newSelectedDays.splice(selectedIndex, 1);
    } else {
      newSelectedDays.push(day);
    }
    setSelectedDays(newSelectedDays);
    props.onClickDay(newSelectedDays);
  };

  return (
    <div>
      <DayPicker selectedDays={selectedDays} onDayClick={handleDayClick} />
    </div>
  );
}
