import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  type?: string;
}

export default function MyTextInput(props: Props) {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props} autoComplete='off' />
      {meta.touched && meta.error ? (
        <Label basic color="red" style={{ marginTop: '2px' }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
