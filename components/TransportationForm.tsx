import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Transportation } from '../models/model';

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
  index: number;
  onClickSave: (t: Transportation) => void;
  transportation: Transportation;
}

type ComponentState = ReturnType<typeof useComponentState>;

const useComponentState = (props: TransportationFormProps) => {
  const t = props.transportation;
  const [departure, setDeparture] = React.useState(t.departure);
  const [arrival, setArrival] = React.useState(t.arrival);
  const [fare, setFare] = React.useState(t.fare);
  const [destination, setDestination] = React.useState(t.destination);
  const [purpose, setPurpose] = React.useState(t.purpose);
  const [line, setLine] = React.useState(t.line);

  const transportation: Transportation = {
    arrival,
    departure,
    destination,
    fare,
    id: 'form-transportation-id',
    line,
    purpose,
    templateId: 'form-template-id'
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
  const componentState = useComponentState(props);
  const componentHandlers = generateComponentHandlers(props, componentState);
  const transportation = componentState.transportation;
  return (
    <div>
      <Typography>Transportation {props.index + 1}</Typography>
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
