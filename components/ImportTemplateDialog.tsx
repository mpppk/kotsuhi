import { Radio } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { TransportationTemplate } from '../models/model';
import Dropzone from './Dropzone';

interface ImportTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onClickCancelButton: () => void;
  onImport: (templates: TransportationTemplate[]) => void;
}

// tslint:disable-next-line variable-name
export const ImportTemplateDialog: React.FC<ImportTemplateDialogProps> = props => {
  const [radioValue, setRadioValue] = useState('from-file');
  const [importURL, setImportURL] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const handleChangeImportURLInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImportURL((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="import-templates-dialog-title"
      aria-describedby="import-templates-dialog-description"
    >
      <DialogTitle id="import-templates-dialog-title">
        {'Import templates'}
      </DialogTitle>
      <DialogContent>
        <RadioGroup
          aria-label="import-type"
          name="import-type"
          value={radioValue}
          onChange={handleChange}
        >
          <FormControlLabel
            value="from-file"
            control={<Radio />}
            label="Import from file"
          />
          <FormControlLabel
            value="from-url"
            control={<Radio />}
            label="Import from URL"
          />
        </RadioGroup>
        {radioValue === 'from-file' ? (
          <Dropzone />
        ) : (
          <TextField
            label="URL"
            value={importURL}
            onChange={handleChangeImportURLInput}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClickCancelButton} color="primary">
          Cancel
        </Button>
        <Button onClick={props.onClickCancelButton} color="primary">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
