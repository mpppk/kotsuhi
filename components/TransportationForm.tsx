import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Line, Transportation } from '../models/model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

interface TransportationFormProps {
  onClickSave: (t: Transportation) => void;
}

type ComponentState = ReturnType<typeof useComponentState>;

const useComponentState = () => {
  const [departure, setDeparture] = React.useState('');
  const [arrival, setArrival] = React.useState('');
  const [fare, setFare] = React.useState(0);
  const [destination, setDestination] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [line, setLine] = React.useState('JR' as Line);

  const transportation: Transportation = {
    arrival,
    departure,
    destination,
    fare,
    line,
    purpose
  };

  return {
    setArrival,
    setDeparture,
    setDestination,
    setFare,
    setLine,
    setPurpose,
    transportation
  };
};

const generateComponentHandlers = (
  props: TransportationFormProps,
  componentState: ComponentState
) => {
  return {
    changeArrivalInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setArrival(e.target.value);
    },
    changeDepartureInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setDeparture(e.target.value);
    },
    changeDestinationInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setDestination(e.target.value);
    },
    changeFareInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setFare(parseInt(e.target.value, 10));
    },
    changeLine: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v === 'JR' || v === '複数') {
        componentState.setLine(v);
      }
    },
    changePurposeInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setPurpose(e.target.value);
    },
    clickSaveButton: () => {
      props.onClickSave(componentState.transportation);
    }
  };
};

// export default function TransportationForm() {
export default function TransportationForm(props: TransportationFormProps) {
  const classes = useStyles(undefined);
  const componentState = useComponentState();
  const componentHandlers = generateComponentHandlers(props, componentState);
  const transportation = componentState.transportation;
  return (
    <div>
      <Typography>Transportation 2</Typography>
      <form className={classes.root}>
        <TextField
          label="出発"
          value={transportation.departure}
          onChange={componentHandlers.changeDepartureInput}
        />
        <TextField
          label="到着"
          value={transportation.arrival}
          onChange={componentHandlers.changeArrivalInput}
        />
        <TextField
          label="運賃"
          value={transportation.fare}
          onChange={componentHandlers.changeFareInput}
        />
        <TextField
          label="目的地"
          value={transportation.destination}
          onChange={componentHandlers.changeDestinationInput}
        />
        <TextField
          label="目的"
          value={transportation.purpose}
          onChange={componentHandlers.changePurposeInput}
        />
        <FormControl>
          <InputLabel>種別</InputLabel>
          <Select value={'JR'}>
            <MenuItem value={'JR'}>JR</MenuItem>
            <MenuItem value={'複数'}>複数</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color={'secondary'}
          onClick={componentHandlers.clickSaveButton}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
