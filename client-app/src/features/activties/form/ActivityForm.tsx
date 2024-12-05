/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextarea from '../../../app/common/form/MyTextarea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const navigate = useNavigate();

  const { id } = useParams();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: '',
  });

  const validation = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required'),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((a) => {
        console.log(a);
        setActivity(a!);
      });
    }
  }, [id, loadActivity]);

  if (loadingInitial)
    return <LoadingComponent content="Loading activity..."></LoadingComponent>;

  function handleFormSubmit(activity: Activity) {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  }

  // function handleChange(
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // }

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal"></Header>
      <Formik
        validationSchema={validation}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({
          values: activity,
          handleChange,
          handleSubmit,
          isValid,
          isSubmitting,
          dirty,
        }) => (
          <Form onSubmit={handleSubmit} autoComplete="off" className="ui form">
            <MyTextInput name="title" placeholder="Title"></MyTextInput>
            <MyTextarea
              placeholder="Description"
              name="description"
              rows={3}
            ></MyTextarea>
            {/* <MyTextInput placeholder="Category" name="category"></MyTextInput> */}
            <MySelectInput
              placeholder="Category"
              name="category"
              options={categoryOptions}
            ></MySelectInput>
            <MyDateInput
              placeholder="Date"
              dateFormat="MMMM, d, yyyy h:mm aa"
              name="date"
            ></MyDateInput>
            <Header content="Location Details" sub color="teal"></Header>
            <MyTextInput placeholder="City" name="city"></MyTextInput>
            <MyTextInput placeholder="Venue" name="venue"></MyTextInput>
            <Button
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={loading}
              disabled={isSubmitting || !dirty || !isValid}
            ></Button>
            <Button
              floated="right"
              positive
              type="button"
              content="Cancel"
              as={Link}
              to="/activities"
            ></Button>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
