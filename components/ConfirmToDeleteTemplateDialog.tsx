import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import React from 'react';
import { TransportationTemplate } from '../models/model';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (template: TransportationTemplate) => void;
  template: TransportationTemplate | null;
}

// tslint:disable-next-line
export const ConfirmToDeleteTemplateDialog: React.FC<ConfirmDialogProps> = props => {
  const title = props.template ? props.template.title : '';

  const handleClickOK = () => {
    props.onConfirm(props.template!);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">Are you sure?</DialogTitle>
      <DialogContent>Template [{title}] will be deleted.</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleClickOK} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
