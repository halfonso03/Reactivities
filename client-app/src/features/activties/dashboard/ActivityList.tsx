import React from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivityList({ activities, selectActivity, deleteActivity }: Props) {
  return (
    <>
      <Segment>
        <Item.Group divided>
          {activities &&
            activities.map((a: Activity) => (
              <Item key={a.title}>
                <Item.Content>
                  <Item.Header as="a">{a.title}</Item.Header>
                  <Item.Meta>{a.date}</Item.Meta>
                  <Item.Description>
                    <div>{a.description}</div>
                    <div>
                      {a.city}, {a.venue}
                    </div>
                  </Item.Description>
                  <Item.Extra>
                    <Button
                      floated="right"
                      content="View"
                      color="blue"
                      onClick={() => selectActivity(a.id)}
                    ></Button>
                    <Button
                      floated="right"
                      content="Delete"
                      color="red"
                      onClick={() => deleteActivity(a.id)}
                    ></Button>
                    <Label basic content={a.category}></Label>
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      </Segment>
    </>
  );
}
