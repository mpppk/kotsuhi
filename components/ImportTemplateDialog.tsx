import { Radio } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from 'react';
import { KotsuhiConfig } from '../services/export';
import Dropzone from './Dropzone';
import { ImportFromURLForm } from './ImportFromURLForm';

interface ImportTemplateDialogProps {
  importURLHistory: string[];
  open: boolean;
  onClose: () => void;
  onClickCancelButton: () => void;
  onClickDeleteImportURL: (url: string) => void;
  onClickImportFromURLButton: (url: string) => void;
  onImport: (kotsuhiConfig: KotsuhiConfig) => void;
  onError: (e: Error) => void;
}

// tslint:disable-next-line variable-name
export const ImportTemplateDialog: React.FC<ImportTemplateDialogProps> = props => {
  const [radioValue, setRadioValue] = useState('from-file');
  const [importURL, setImportURL] = useState('https://');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const handleChangeImportURLInput = (url: string) => {
    setImportURL(url);
  };

  const handleDropzoneError = (e: Error) => {
    props.onError(e);
  };

  const handleClickImportFromURLButton = () => {
    props.onClickImportFromURLButton(importURL);
  };

  const handleClickDeleteImportURL = (url: string) => {
    props.onClickDeleteImportURL(url);
  };

  const handleClickImportURLHistory = (url: string) => {
    setImportURL(url);
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
          <Dropzone onError={handleDropzoneError} onUpload={props.onImport} />
        ) : (
          <ImportFromURLForm
            importURL={importURL}
            importURLHistory={props.importURLHistory}
            onChangeImportURL={handleChangeImportURLInput}
            onClickDeleteImportURL={handleClickDeleteImportURL}
            onClickImportURLHistory={handleClickImportURLHistory}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClickCancelButton} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleClickImportFromURLButton}
          color="primary"
          disabled={importURL.length < 10}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
