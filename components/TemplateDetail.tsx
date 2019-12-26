import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/EditOutlined';
import { useState } from 'react';
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

export default function TemplateDetail(props: TemplateDetailProps) {
  const classes = useStyles(undefined);
  const handleClickDay = (days: Date[]) => {
    // tslint:disable-next-line
    console.log(days);
  };

  const [editTransportationIndices, setEditTransportationIndices] = useState(
    [] as number[]
  );
  const genClickEditTransportationButtonHandler = (i: number) => {
    return () => {
      setEditTransportationIndices([...editTransportationIndices, i]);
    };
  };

  const genClickSaveButtonHandler = (i: number) => {
    return (_transportation: TransportationEntity) => {
      const newEditTransportationIndices = [...editTransportationIndices];
      newEditTransportationIndices.splice(i, 1);
      setEditTransportationIndices(newEditTransportationIndices);
    };
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
        {props.template.transportations.map((t, i) =>
          editTransportationIndices.includes(i) ? (
            <TransportationForm
              index={i}
              key={t.arrival + t.departure + i + '_edit'}
              onClickSave={genClickSaveButtonHandler(i)}
            />
          ) : (
            <Transportation
              transportation={t}
              index={i + 1}
              key={t.arrival + t.departure + i}
              onClickEditButton={genClickEditTransportationButtonHandler(i)}
            />
          )
        )}
        <Button variant="outlined">Add transportation</Button>
      </div>
      <DaysPicker onClickDay={handleClickDay} />
    </Paper>
  );
}
