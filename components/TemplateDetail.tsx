import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/EditOutlined';
import * as React from 'react';
import {
  Transportation as TransportationEntity,
  TransportationTemplate
} from '../models/model';
import DaysPicker from './DaysPicker';
import Transportation from './Transportation';
import TransportationForm from './TransportationForm';

interface TemplateDetailProps {
  template: TransportationTemplate;
}

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

export default function TemplateDetail(props: TemplateDetailProps) {
  const classes = useStyles(undefined);
  const handleClickDay = (days: Date[]) => {
    // tslint:disable-next-line
    console.log(days);
  };
  return (
    <Paper>
      <div className={classes.content}>
        <Typography variant={'h4'}>
          {props.template.title}
          <IconButton edge="end" aria-label="more">
            <Edit />
          </IconButton>
        </Typography>
        {props.template.transportations.map((t, i) => (
          <Transportation
            transportation={t}
            index={i + 1}
            key={t.arrival + t.departure + i}
          />
        ))}
        <TransportationForm onClickSave={emptyHandler} />
        <Button variant="outlined">Add transportation</Button>
      </div>
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
