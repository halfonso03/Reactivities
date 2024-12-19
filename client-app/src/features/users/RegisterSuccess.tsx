import { toast } from 'react-toastify';
import agent from '../../api/agent';
import useQuery from '../../app/hooks';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function RegisterSuccess() {
  const email = useQuery().get('email') as string;

  function handleConfirmEmailResend() {
    agent.Account.resendEmailConfirm(email)
      .then(() => toast.success('Verification email sent'))
      .catch((error) => console.log(error));
  }

  return (
    <Segment placeholder textAlign="center">
      <Header icon color="green">
        <Icon name="check"></Icon>
        Sucessfulyl Registered!
      </Header>
      <p>Please check your email</p>
      {email && (
        <>
          <p>Didnt get th email? Click the button</p>
          <Button
            primary
            onClick={handleConfirmEmailResend}
            content="Resend email"
            size="huge"
          ></Button>
        </>
      )}
    </Segment>
  );
}
