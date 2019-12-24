import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/EditOutlined';
import * as React from 'react';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {}
  })
);

export default function TransportationForm() {
  const classes = useStyles(undefined);
  return (
    <div className={classes.root}>
      <Typography>
        Transportation 1
        <IconButton edge="end" aria-label="more">
          <Edit />
        </IconButton>
      </Typography>
      <p>横浜→東京 ¥525 JR どこかビル 打ち合わせ</p>
    </div>
  );
}
