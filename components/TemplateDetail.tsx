import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useState } from 'react';
import * as React from 'react';
import {
  Transportation as TransportationEntity,
  TransportationTemplate
} from '../models/model';
import DaysPicker from './DaysPicker';
import TemplateDetailTitle from './TemplateDetailTitle';
import TemplateDetailTitleForm from './TemplateDetailTitleForm';
import Transportation from './Transportation';
import TransportationForm from './TransportationForm';

interface TemplateDetailProps {
  isEditingTitle: boolean;
  template: TransportationTemplate;
  onClickDeleteTransportationButton: (t: TransportationEntity) => void;
  onClickEditTitleButton: (title: string) => void;
  onClickSaveTitleButton: (title: string) => void;
  onUpdate: (t: TransportationEntity, i: number) => void;
  onUpdateCalendar: (dates: Date[]) => void;
  selectedDays: Date[];
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
    props.onUpdateCalendar(days);
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
    return (transportation: TransportationEntity) => {
      const newEditTransportationIndices = editTransportationIndices.filter(
        ei => ei !== i
      );
      setEditTransportationIndices(newEditTransportationIndices);
      props.onUpdate(transportation, i);
    };
  };

  const handleClickEditTitleButton = () => {
    props.onClickEditTitleButton(props.template.title);
  };

  return (
    <Paper>
      <div className={classes.content}>
        {props.isEditingTitle ? (
          <TemplateDetailTitleForm
            title={props.template.title}
            onClickSaveTitleButton={props.onClickSaveTitleButton}
          />
        ) : (
          <TemplateDetailTitle
            title={props.template.title}
            onClickEditButton={handleClickEditTitleButton}
          />
        )}
        {props.template.transportations.map((t, i) =>
          editTransportationIndices.includes(i) ? (
            <TransportationForm
              transportation={t}
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
              onClickDeleteButton={props.onClickDeleteTransportationButton}
            />
          )
        )}
        <Button variant="outlined">Add transportation</Button>
      </div>
      <DaysPicker
        onClickDay={handleClickDay}
        selectedDays={props.selectedDays}
      />
    </Paper>
  );
}
