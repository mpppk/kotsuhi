import { Badge } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import NoteIcon from '@material-ui/icons/NoteOutlined';
import * as React from 'react';
import { TransportationTemplate } from '../models/model';

interface TemplateListItemProps {
  badgeNum: number;
  template: TransportationTemplate;
  selected: boolean;
  onClick: (t: TransportationTemplate) => void;
  onClickDeleteButton: (t: TransportationTemplate) => void;
}

export default function TemplateListItem(props: TemplateListItemProps) {
  const handleClick = () => {
    props.onClick(props.template);
  };

  const handleClickDeleteButton = () => {
    props.onClickDeleteButton(props.template);
  };

  return (
    <ListItem button={true} selected={props.selected} onClick={handleClick}>
      <ListItemIcon>
        <Badge badgeContent={props.badgeNum} color="secondary">
          <NoteIcon />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={props.template.title} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={handleClickDeleteButton}
          edge="end"
          aria-label="more"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
