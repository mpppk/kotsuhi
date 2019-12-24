import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import DaysPicker from './DaysPicker';
import Transportation from './Transportation';
import TransportationForm from './TransportationForm';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    content: {
      padding: 16
    }
  })
);

export default function TemplateDetail() {
  const classes = useStyles(undefined);
  const handleClickDay = (days: Date[]) => {
    // tslint:disable-next-line
    console.log(days);
  };
  return (
    <Paper>
      <div className={classes.content}>
        <Typography variant={'h4'}>Template2</Typography>
        <Transportation />
        <TransportationForm />
        <Button variant="outlined">Add transportation</Button>
      </div>
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
