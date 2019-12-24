import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

export default function TransportationForm() {
  const classes = useStyles(undefined);
  return (
    <div>
      <Typography>Transportation 2</Typography>
      <form className={classes.root}>
        <TextField label="出発" value={'東京'} />
        <TextField label="到着" value={'横浜'} />
        <TextField label="運賃" value="525" />
        <TextField label="目的地" value="自社" />
        <TextField label="目的" value="帰社" />
        <FormControl>
          <InputLabel>種別</InputLabel>
          <Select value={'JR'}>
            <MenuItem value={'JR'}>JR</MenuItem>
            <MenuItem value={'複数'}>複数</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" color={'secondary'}>
          Save
        </Button>
      </form>
    </div>
  );
}
