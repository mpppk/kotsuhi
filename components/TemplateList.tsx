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
  badgeNums: number[];
  templates: TransportationTemplate[];
  onClick: (t: TransportationTemplate, i: number) => void;
}

export default function TemplateList(props: TemplateListProps) {
  const classes = useStyles(undefined);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const genClickItemHandler = (index: number) => {
    return (t: TransportationTemplate) => {
      setSelectedIndex(index);
      props.onClick(t, index);
    };
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        {props.templates.map((t, i) => {
          return (
            <TemplateListItem
              badgeNum={props.badgeNums[i]}
              key={i}
              template={t}
              onClick={genClickItemHandler(i)}
              selected={i === selectedIndex}
            />
          );
        })}
      </List>
    </div>
  );
}
