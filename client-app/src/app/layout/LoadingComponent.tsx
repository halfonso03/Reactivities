import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  inverted?: boolean;
  content?: string;
}

export default function LoadingComponent({
  inverted = true,
  content = 'Loading...',
}: Props) {
  

  return (
    <Dimmer active={true}>
      <Loader inverted={inverted} content={content} />
    </Dimmer>
  );
}
