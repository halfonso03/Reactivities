/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { SyntheticEvent, useState } from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
  selectedActivity: Activity | undefined;
}

export default function ActivityList({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  selectedActivity,
}: Props) {
  const [target, setTarget] = useState('');

  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

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
                      name={a.id}
                      floated="right"
                      content="Delete"
                      loading={target === a.id && submitting}
                      color="red"
                      onClick={(event) => {
                        handleActivityDelete(event, a.id);
                        // selectActivity(a.id);
                        // console.log(a.id, selectedActivity?.id);
                        // deleteActivity(a.id);
                      }}
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
