import { CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { CsvConfig } from '../services/csv';

interface ConfigCardFormProps {
  config: CsvConfig;
  onClickSave: (config: CsvConfig) => void;
}

type ComponentState = ReturnType<typeof useComponentState>;
const useComponentState = (config: CsvConfig) => {
  const [employeeId, setEmployeeId] = React.useState(config.employeeId);
  const [code, setCode] = React.useState(config.code);
  const [version, setVersion] = React.useState(config.version);
  return {
    config: {
      code,
      employeeId,
      version
    } as CsvConfig,
    setCode,
    setEmployeeId,
    setVersion
  };
};

const generateComponentHandlers = (
  props: ConfigCardFormProps,
  componentState: ComponentState
) => {
  return {
    changeCodeInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setCode(e.target.value);
    },
    changeEmployeeIdInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setEmployeeId(e.target.value);
    },
    changeVersionInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      componentState.setVersion(e.target.value);
    },
    clickSaveButton: () => {
      props.onClickSave(componentState.config);
    }
  };
};

// tslint:disable-next-line variable-name
export const ConfigCardForm: React.FC<ConfigCardFormProps> = props => {
  const componentState = useComponentState(props.config);
  const componentHandlers = generateComponentHandlers(props, componentState);
  return (
    <Card>
      <CardContent>
        <form>
          <TextField
            label="社員番号"
            value={componentState.config.employeeId}
            onChange={componentHandlers.changeEmployeeIdInput}
          />
          <TextField
            label="コード"
            value={componentState.config.code}
            onChange={componentHandlers.changeCodeInput}
          />
          <TextField
            label="version"
            value={componentState.config.version}
            onChange={componentHandlers.changeVersionInput}
          />
          <Button
            variant="outlined"
            color={'secondary'}
            onClick={componentHandlers.clickSaveButton}
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
