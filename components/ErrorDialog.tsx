import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

interface ErrorDialogProps {
  error: Error | null;
  onClose: () => void;
  open: boolean;
}

interface ErrorDetailsProps {
  details: string;
}

// tslint:disable-next-line variable-name
const ErrorDetails: React.FC<ErrorDetailsProps> = props => {
  return (
    <details>
      <summary>Details</summary>
      {props.details}
    </details>
  );
};

// tslint:disable-next-line
export const ErrorDialog: React.FC<ErrorDialogProps> = props => {
  const errorName = props.error ? props.error.name : '';
  const errorMessage = props.error ? props.error.message : '';
  const errorStack = props.error && props.error.stack ? props.error.stack : '';
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">{errorName}</DialogTitle>
      <DialogContent>
        {errorMessage}
        {errorStack === '' ? null : <ErrorDetails details={errorStack} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
