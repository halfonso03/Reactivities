import { Message } from 'semantic-ui-react';

interface Props {
  errors: string[];
}

export default function ValidationError({ errors }: Props) {
  return (
    <>
      <Message error>
        {errors && (
          <Message.List>
            {errors.map((e: string, i) => {
              return <Message.Item key={i}>{e}</Message.Item>;
            })}
          </Message.List>
        )}
      </Message>
    </>
  );
}
