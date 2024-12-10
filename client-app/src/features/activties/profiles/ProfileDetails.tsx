import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextarea from '../../../app/common/form/MyTextarea';
import { ProfileFormValues } from '../../../app/models/profile';
import * as Yup from 'yup';

export default function ProfileDetails() {
  const { profileStore } = useStore();
  const { profile, updateProfile } = profileStore;
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues>(
    new ProfileFormValues(profile!.displayName!, profile!.bio! || '')
  );

  const validation = Yup.object({
    displayName: Yup.string().required('Display Name is required'),
  });

  function handleFormSubmit(values: ProfileFormValues) {
    updateProfile(values).then(() => {
      setEditing(false);
      setProfileData({ displayName: values.displayName, bio: values.bio });
    });
  }

  return (
    <>
      <Segment clearing basic>
        <Header
          as="h4"
          floated="left"
          icon={'user'}
          content={`About ${profile?.displayName}`}
        ></Header>
        <Header floated="right">
          <Button
            floated="right"
            basic
            size="tiny"
            onClick={() => {
              setEditing(!editing);
            }}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Header>
      </Segment>
      {editing && (
        <Segment clearing basic>
          <Formik
            validationSchema={validation}
            initialValues={profileData}
            onSubmit={(values) => handleFormSubmit(values)}
          >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                className="ui form"
              >
                <MyTextInput
                  name="displayName"
                  placeholder="Name"
                ></MyTextInput>
                <MyTextarea name="bio" placeholder="Bio" rows={3}></MyTextarea>
                <Button
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || !dirty || !isValid}
                ></Button>
              </Form>
            )}
          </Formik>
        </Segment>
      )}
    </>
  );
}
