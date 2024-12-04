/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { Container, Header, Segment } from 'semantic-ui-react';

export default observer(function ServerError() {
  const { commonStore } = useStore();

  return (
    <Container>
      <Header as="h1" content="Srver Error"></Header>
      <Header
        as="h5"
        color="red"
        content={commonStore?.error?.message}
      ></Header>
      {commonStore.error?.details && (
        <Segment>
          <Header as="h4" content="Stack Trace" color="teal">
            <code style={{ marginTop: 10 }}>{commonStore.error.details}</code>
          </Header>
        </Segment>
      )}
    </Container>
  );
});
