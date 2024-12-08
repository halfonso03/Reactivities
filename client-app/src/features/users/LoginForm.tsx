/* eslint-disable react-refresh/only-export-components */
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .catch(() => setErrors({ error: 'Invalid Email or Password' }))
      }
    >
      {({ handleSubmit, errors, isSubmitting }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="">
          <Header
            as="h2"
            content="Loding to Reactivties"
            color="teal"
            textAlign="center"
          ></Header>
          <MyTextInput placeholder="Email" name="email"></MyTextInput>
          <MyTextInput
            placeholder="Password"
            name="password"
            type="password"
          ></MyTextInput>
          <ErrorMessage
            name="error"
            render={() => (
              <Label
                basic
                style={{ marginBottom: 10 }}
                color="red"
                content={errors.error}
              ></Label>
            )}
          ></ErrorMessage>
          <Button
            positive
            className={isSubmitting ? 'loading' : ''}
            disabled={isSubmitting}
            content={'Login'}
            type="submit"
            fluid
          ></Button>
        </Form>
      )}
    </Formik>
  );
});
