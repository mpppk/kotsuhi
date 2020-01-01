import { Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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

function Dropzone() {
  const classes = useStyles();
  const onDrop = useCallback(_acceptedFiles => {
    // Do something with the files
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
