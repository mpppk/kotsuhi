import { CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditOutlined';
import React from 'react';
import { CsvConfig } from '../services/csv';

interface ConfigCardProps {
  config: CsvConfig;
  onClickEdit: (config: CsvConfig) => void;
}

// tslint:disable-next-line variable-name
export const ConfigCard: React.FC<ConfigCardProps> = props => {
  const handleClickEdit = () => {
    props.onClickEdit(props.config);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.config.employeeId} - {props.config.code}
          <IconButton edge="end" aria-label="more" onClick={handleClickEdit}>
            <EditIcon />
          </IconButton>
        </Typography>
        <Typography color="textSecondary">{props.config.version}</Typography>
      </CardContent>
    </Card>
  );
};
