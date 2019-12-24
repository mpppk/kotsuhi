import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NoteIcon from '@material-ui/icons/Note';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 360,
      width: '100%'
    }
  })
);

export default function TemplateList() {
  const classes = useStyles(undefined);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListItem
          button={true}
          selected={selectedIndex === 0}
          onClick={event => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <NoteIcon />
          </ListItemIcon>
          <ListItemText primary="Template1" />
        </ListItem>
        <ListItem
          button={true}
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <Badge badgeContent={3} color="secondary">
              <NoteIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Template2" />
        </ListItem>
        <ListItem
          button={true}
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <Badge badgeContent={2} color="secondary">
              <NoteIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Template3" />
        </ListItem>
      </List>
    </div>
  );
}
