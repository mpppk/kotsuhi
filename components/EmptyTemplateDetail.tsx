import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';

// tslint:disable-next-line variable-name
export const EmptyTemplateDetail: React.FC = () => {
  return (
    <Paper>
      <Typography variant={'h4'}>No template is selected.</Typography>
      Select template from left list.
    </Paper>
  );
};
