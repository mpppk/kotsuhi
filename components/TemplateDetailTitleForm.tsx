import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import * as React from 'react';

export interface TemplateDetailTitleFormProps {
  onClickSaveTitleButton: (title: string) => void;
  title: string;
}

const useComponentState = (props: TemplateDetailTitleFormProps) => {
  const [title, setTitle] = useState(props.title);
  return {
    setTitle,
    title
  };
};

export default function TemplateDetailTitleForm(
  props: TemplateDetailTitleFormProps
) {
  const componentState = useComponentState(props);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    componentState.setTitle(e.target.value);
  };

  const handleClickSaveTitleButton = () => {
    props.onClickSaveTitleButton(componentState.title);
  };

  return (
    <div>
      <TextField
        label="title"
        value={componentState.title}
        onChange={handleChangeInput}
      />
      <Button
        variant="outlined"
        color={'secondary'}
        onClick={handleClickSaveTitleButton}
      >
        Save
      </Button>
    </div>
  );
}