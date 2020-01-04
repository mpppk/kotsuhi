import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import {
  TemplateID,
  Transportation as TransportationEntity,
  TransportationID,
  TransportationTemplate
} from '../models/model';
import DaysPicker from './DaysPicker';
import TemplateDetailTitle from './TemplateDetailTitle';
import TemplateDetailTitleForm from './TemplateDetailTitleForm';
import Transportation from './Transportation';
import TransportationForm from './TransportationForm';

interface TemplateDetailProps {
  editingTransportationId: TransportationID | null;
  isEditingTitle: boolean;
  focusTitle: boolean;
  template: TransportationTemplate | null;
  onCancelTransportationEditing: () => void;
  onClickAddTransportationButton: (templateId: TemplateID) => void;
  onClickDeleteTransportationButton: (t: TransportationEntity) => void;
  onClickEditTitleButton: (title: string) => void;
  onClickEditTransportationButton: (
    transportation: TransportationEntity
  ) => void;
  onClickSaveTitleButton: (title: string) => void;
  onUpdate: (t: TransportationEntity) => void;
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

  const handleClickNewTransportationButton = () => {
    if (props.template) {
      props.onClickAddTransportationButton(props.template.id);
    }
  };

  const handleClickEditTitleButton = () => {
    if (props.template) {
      props.onClickEditTitleButton(props.template.title);
    }
  };

  const transportations = props.template ? props.template.transportations : [];

  return (
    <Paper>
      <div className={classes.content}>
        {props.isEditingTitle ? (
          <TemplateDetailTitleForm
            focus={props.focusTitle}
            title={props.template ? props.template.title : ''}
            onClickSaveTitleButton={props.onClickSaveTitleButton}
          />
        ) : (
          <TemplateDetailTitle
            title={props.template ? props.template.title : ''}
            onClickEditButton={handleClickEditTitleButton}
          />
        )}
        {transportations.map((t, i) =>
          props.editingTransportationId === t.id ? (
            <TransportationForm
              transportation={t}
              index={i + 1}
              key={t.id + '_edit'}
              onClickCancel={props.onCancelTransportationEditing}
              onClickSave={props.onUpdate}
            />
          ) : (
            <Transportation
              transportation={t}
              index={i + 1}
              key={t.arrival + t.departure + i}
              onClickEditButton={props.onClickEditTransportationButton}
              onClickDeleteButton={props.onClickDeleteTransportationButton}
            />
          )
        )}
        <Button variant="outlined" onClick={handleClickNewTransportationButton}>
          Add transportation
        </Button>
      </div>
      <DaysPicker
        onClickDay={handleClickDay}
        selectedDays={props.selectedDays}
      />
    </Paper>
  );
}
