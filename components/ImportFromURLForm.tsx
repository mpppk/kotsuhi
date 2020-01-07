import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField/TextField';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import React from 'react';

export interface ImportFromURLFormProps {
  importURL: string;
  importURLHistory: string[];
  onChangeImportURL: (url: string) => void;
  onClickDeleteImportURL: (url: string) => void;
  onClickImportURLHistory: (url: string) => void;
}

// tslint:disable-next-line
export const ImportFromURLForm: React.FC<ImportFromURLFormProps> = props => {
  const handleChangeImportURLInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.onChangeImportURL(event.target.value);
  };

  const genClickImportURLHistoryHandler = (url: string) => {
    return () => {
      props.onClickImportURLHistory(url);
    };
  };

  const genClickDeleteButtonHandler = (url: string) => {
    return () => {
      props.onClickDeleteImportURL(url);
    };
  };

  return (
    <div>
      <TextField
        label="URL"
        value={props.importURL}
        onChange={handleChangeImportURLInput}
      />
      <List
        component="nav"
        aria-label=""
        subheader={<ListSubheader component="div">History</ListSubheader>}
      >
        {props.importURLHistory.map(history => {
          return (
            <ListItem
              key={'history_' + history}
              button={true}
              onClick={genClickImportURLHistoryHandler(history)}
            >
              <ListItemText primary={history} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={genClickDeleteButtonHandler(history)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
