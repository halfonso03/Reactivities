import { useField } from 'formik';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
  placeholder: string;
  name: string;
  options: { text: string; value: string }[];
  label?: string;
}

export default function MySelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        options={props.options}
        value={field.value || null}
        onChange={(_, data) => helpers.setValue(data.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red" style={{ marginTop: '2px' }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}