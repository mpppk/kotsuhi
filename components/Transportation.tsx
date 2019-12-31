import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/DeleteOutlined';
import Edit from '@material-ui/icons/EditOutlined';
import * as React from 'react';
import { Transportation as TransportationEntity } from '../models/model';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {}
  })
);

interface TransportationProps {
  index: number;
  onClickEditButton: (t: TransportationEntity) => void;
  onClickDeleteButton: (t: TransportationEntity) => void;
  transportation: TransportationEntity;
}

export default function Transportation(props: TransportationProps) {
  const classes = useStyles(undefined);
  const t = props.transportation;

  const handleClickEditButton = () => {
    props.onClickEditButton(props.transportation);
  };

  const handleClickDeleteButton = () => {
    props.onClickDeleteButton(props.transportation);
  };

  return (
    <div className={classes.root}>
      <Typography>
        Transportation {props.index}
        <IconButton
          onClick={handleClickEditButton}
          edge="end"
          aria-label="more"
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={handleClickDeleteButton}
          edge="end"
          aria-label="more"
        >
          <Delete />
        </IconButton>
      </Typography>
      <p>
        {t.departure}→{t.arrival} ¥{t.fare} {t.line} {t.destination} {t.purpose}
      </p>
    </div>
  );
}
