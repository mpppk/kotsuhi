import { Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import DaysPicker from './DaysPicker';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    title: {
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
      <Typography variant={'h4'} className={classes.title}>
        Template1
      </Typography>
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
