import { Link } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';

export default function NotFound() {
  return (
    <Segment placeholder>
      <Header>
        <Segment.Inline content="Oops- Page Not Found."></Segment.Inline>
        {/* <Search></Search> */}
      </Header>
      <Segment.Inline>
        <Button
          as={Link}
          to="/activities"
          content="Return to Activities Page"
        ></Button>
      </Segment.Inline>
    </Segment>
  );
}
