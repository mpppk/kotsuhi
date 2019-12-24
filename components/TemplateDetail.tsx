import { Paper } from '@material-ui/core';
import * as React from 'react';
import DaysPicker from './DaysPicker';

export default function TemplateDetail() {
  const handleClickDay = (days: Date[]) => {
    // tslint:disable-next-line
    console.log(days);
  };
  return (
    <Paper>
      aaa
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
