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
  index: number;
  onClickCancel: () => void;
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
    id: props.transportation.id,
    line,
    purpose,
    templateId: props.transportation.templateId
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
    changeLine: (e: React.ChangeEvent<{ value: unknown }>) => {
      const v = e.target.value;
      componentState.setLine(v as Line);
    },
    changePurposeInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setPurpose(e.target.value);
    },
    clickCancelButton: () => {
      props.onClickCancel();
    },
    clickSaveButton: () => {
      props.onClickSave(componentState.transportation);
    }
  };
};

export default function TransportationForm(props: TransportationFormProps) {
  const classes = useStyles(undefined);
  const componentState = useComponentState(props);
  const componentHandlers = generateComponentHandlers(props, componentState);
  const transportation = componentState.transportation;
  return (
    <div>
      <Typography>Transportation {props.index}</Typography>
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
          <Select
            value={componentState.transportation.line}
            onChange={componentHandlers.changeLine}
          >
            <MenuItem value={'ＪＲ'}>ＪＲ</MenuItem>
            <MenuItem value={'私鉄'}>私鉄</MenuItem>
            <MenuItem value={'地下鉄'}>地下鉄</MenuItem>
            <MenuItem value={'バス'}>バス</MenuItem>
            <MenuItem value={'モノレール'}>モノレール</MenuItem>
            <MenuItem value={'定期船'}>定期船</MenuItem>
            <MenuItem value={'タクシー（業務昼間）'}>
              タクシー（業務昼間）
            </MenuItem>
            <MenuItem value={'タクシー(業務深夜)'}>タクシー(業務深夜)</MenuItem>
            <MenuItem value={'タクシー(交際費)'}>タクシー(交際費)</MenuItem>
            <MenuItem value={'Suica等Card'}>Suica等Card</MenuItem>
            <MenuItem value={'複数'}>複数</MenuItem>
            <MenuItem value={'深夜ホテル'}>深夜ホテル</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={componentHandlers.clickCancelButton}
        >
          Cancel
        </Button>
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
