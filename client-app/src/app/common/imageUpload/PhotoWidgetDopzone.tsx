/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface Props {
  setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
  const dzStyles = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as const,
    height: 200,
  };

  const dzActive = {
    borderColor: 'green',
  };

  const onDrop = useCallback(
    (acceptedFiles: object[]) => {
      // Do something with the files
      console.log(acceptedFiles);

      setFiles(() => {
        
        const newFile = Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0] as Blob),
        });

        console.log('newFile', newFile);

        return acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      });
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : { ...dzStyles }}
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge"></Icon>
      <Header content="Drop image here"></Header>
    </div>
  );
}
