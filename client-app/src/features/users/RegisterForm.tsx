/* eslint-disable react-refresh/only-export-components */
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError';

export default observer(function RegisterForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{
        displayName: '',
        userName: '',
        email: '',
        password: '',
        error: null,
      }}
      onSubmit={(values, { setErrors }) => {
        userStore.register(values).catch((error) => {
          setErrors({ error });
          //resetForm();
        });
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required('Display Name is required'),
        userName: Yup.string().required('User name is required'),
        email: Yup.string()
          .email('Invalid Email')
          .required('Email is required'),
        password: Yup.string().required('Password is required'),
      })}
    >
      {({ handleSubmit, errors, isSubmitting, isValid, dirty }) => (
        <Form className="ui form error" onSubmit={handleSubmit} autoComplete="">
          <Header
            as="h2"
            content="Sign up to Reactivties"
            color="teal"
            textAlign="center"
          ></Header>
          <MyTextInput placeholder="Email" name="email"></MyTextInput>
          <MyTextInput
            placeholder="Display Name"
            name="displayName"
          ></MyTextInput>
          <MyTextInput placeholder="User Name" name="userName"></MyTextInput>
          <MyTextInput
            placeholder="Password"
            name="password"
            type="password"
          ></MyTextInput>
          <ErrorMessage
            name="error"
            render={() => (
              <ValidationError
                errors={errors.error as unknown as string[]}
              ></ValidationError>
            )}
          ></ErrorMessage>
          <Button
            positive
            loading={isSubmitting && !errors}
            className={isSubmitting ? 'loading' : ''}
            disabled={isSubmitting || !dirty || !isValid}
            content={'Register'}
            type="submit"
            fluid
          ></Button>
        </Form>
      )}
    </Formik>
  );
});
