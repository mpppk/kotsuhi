import { Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TransportationTemplate } from '../models/model';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center'
    },
    uploadIcon: {
      fontSize: 40
    }
  })
);

interface DropzoneProps {
  onUpload: (templates: TransportationTemplate[]) => void;
  onError: (e: Error) => void;
}

function Dropzone(props: DropzoneProps) {
  const classes = useStyles();
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();
    reader.onabort = () => props.onError(Error('file reading was aborted'));
    reader.onerror = () => props.onError(Error('file reading has failed'));
    reader.onload = () => {
      const contents = reader.result;
      if (contents === null) {
        props.onError(Error('file contents is null'));
        return;
      }
      try {
        const templates = JSON.parse(contents as string);
        props.onUpload(templates);
      } catch (e) {
        props.onError(e);
      }
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Paper {...getRootProps()} className={classes.root}>
      <input {...getInputProps()} />
      <UploadIcon className={classes.uploadIcon} />
      {isDragActive ? (
        <p>Drop the template json here ...</p>
      ) : (
        <p>
          Drag 'n' drop template json here, or click to select template file
        </p>
      )}
    </Paper>
  );
}

export default Dropzone;
