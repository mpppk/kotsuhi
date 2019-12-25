import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/EditOutlined';
import * as React from 'react';
import { Transportation as TransportationEntity } from '../models/transportation';
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

const emptyHandler = (transportation: TransportationEntity) => {
  console.log('hello', transportation);
};

export default function TemplateDetail() {
  const classes = useStyles(undefined);
  const handleClickDay = (days: Date[]) => {
    // tslint:disable-next-line
    console.log(days);
  };
  return (
    <Paper>
      <div className={classes.content}>
        <Typography variant={'h4'}>
          Template2
          <IconButton edge="end" aria-label="more">
            <Edit />
          </IconButton>
        </Typography>
        <Transportation />
        <TransportationForm onClickSave={emptyHandler} />
        <Button variant="outlined">Add transportation</Button>
      </div>
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
