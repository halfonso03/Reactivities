/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { Segment, Header, Comment,  Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    commentStore.createHubConnection(activityId);
    return () => {
      commentStore.clearComments();
    };
  }, [activityId, commentStore]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment clearing>
      <Formik
          onSubmit={(values, { resetForm }) =>
            commentStore.addComment(values).then(() => resetForm())
          }
          initialValues={{ body: '' }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: 'relative' }}>
                    <Loader active={isSubmitting}></Loader>
                    <textarea
                      id=""
                      placeholder="Enter comment, press enter to submit"
                      rows={2}
                      {...props.field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          return;
                        }

                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (isValid) handleSubmit();
                        }
                      }}
                    ></textarea>
                  </div>
                )}
              </Field>
              {/* <MyTextarea
                placeholder="Add Comment"
                name="body"
                rows={2}
              ></MyTextarea>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting || !isValid}
                content="Add Reply"
                primary
                type="submit"
                floated="right"
              >
                Add Reply
              </Button> */}
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src="/assets/user.png" />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.username}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)}</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
       
      </Segment>
    </>
  );
});
