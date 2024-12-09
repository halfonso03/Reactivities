import { Button, Grid, GridColumn, GridRow, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDopzone';
import { useEffect, useState } from 'react';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) =>  {
        uploadPhoto(blob!)
      });
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: object & { preview?: string }) => {
        URL.revokeObjectURL(file.preview!);
      });
    };
  }, [files]);

  return (
    <div>
      <Grid columns="three" divided>
        <GridRow>
          <GridColumn>
            <Header sub color="teal" content="Step 1 - Add Photo"></Header>
            <PhotoWidgetDropzone setFiles={setFiles}></PhotoWidgetDropzone>
          </GridColumn>

          <GridColumn>
            <Header sub color="teal" content="Step 2 - Resize Image"></Header>

            {files && files.length > 0 && (
              <PhotoWidgetCropper
                setCropper={setCropper}
                imagePreview={files[0].preview}
              ></PhotoWidgetCropper>
            )}
          </GridColumn>

          <GridColumn>
            <Header
              sub
              color="teal"
              content="Step 3 - Preview & Upload"
            ></Header>
            {files && files.length > 0 && (
              <>
                <div
                  className="img-preview"
                  style={{ minHeight: 200, overflow: 'hidden' }}
                ></div>
                <Button.Group widths={2}>
                  <Button onClick={onCrop} positive icon="check" loading={loading}></Button>
                  <Button onClick={() => setFiles([])} icon="close" disabled={loading}></Button>
                </Button.Group>
              </>
            )}
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
}
