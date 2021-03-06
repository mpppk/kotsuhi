import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/EditOutlined';
import * as React from 'react';

export interface TemplateDetailTitleProps {
  onClickEditButton: () => void;
  title: string;
}

export default function TemplateDetailTitle(props: TemplateDetailTitleProps) {
  const handleClick = () => {
    props.onClickEditButton();
  };

  return (
    <Typography variant={'h4'} data-cy={'template-title'}>
      {props.title}
      <IconButton edge="end" aria-label="Edit template title" onClick={handleClick}>
        <Edit />
      </IconButton>
    </Typography>
  );
}
