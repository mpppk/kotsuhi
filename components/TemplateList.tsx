import List from '@material-ui/core/List';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { TransportationTemplate } from '../models/model';
import TemplateListItem from './TemplateListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 360,
      width: '100%'
    }
  })
);

interface TemplateListProps {
  badgeNums: { [k: string]: number };
  templates: TransportationTemplate[];
  onClick: (t: TransportationTemplate) => void;
  onDelete: (t: TransportationTemplate) => void;
}

export default function TemplateList(props: TemplateListProps) {
  const classes = useStyles(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(
    'non-exist-id'
  );

  const handleClickItem = (t: TransportationTemplate) => {
    setSelectedTemplateId(t.id);
    props.onClick(t);
  };

  const handleClickDeleteItemButton = (t: TransportationTemplate) => {
    if (selectedTemplateId === t.id) {
      setSelectedTemplateId('non-exist-id');
    }
    props.onDelete(t);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        {props.templates.map(t => {
          return (
            <TemplateListItem
              badgeNum={props.badgeNums[t.id]}
              key={'TemplateListItem_' + t.id}
              template={t}
              onClick={handleClickItem}
              selected={t.id === selectedTemplateId}
              onClickDeleteButton={handleClickDeleteItemButton}
            />
          );
        })}
      </List>
    </div>
  );
}
