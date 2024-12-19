import { useEffect, useState } from 'react';
import useQuery from '../../app/hooks';
import { useStore } from '../../app/stores/store';
import agent from '../../api/agent';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import LoginForm from './LoginForm';

export default function ConfirmEmail() {
  const { modalStore } = useStore();

  const email = useQuery().get('email') as string;
  const token = useQuery().get('token') as string;

  const Status = {
    Verifying: 'Verifying',
    Failed: 'Failed',
    Success: 'Success',
  };

  const [status, setStatus] = useState(Status.Verifying);

  function handleConfirmEmailResend() {
    agent.Account.resendEmailConfirm(email)
      .then(() => toast.success('Verification email sent'))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    agent.Account.verifyEmail(token, email)
      .then(() => setStatus(Status.Success))
      .catch((error) => {
        console.log(error)
        setStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, email, token]);

  function getBody() {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div>
            <p>
              Verificaion Failed: You can try resending the verify link to your
              emai
            </p>
            <Button
              primary
              onClick={handleConfirmEmailResend}
              size="huge"
              content="Resend Email"
            ></Button>
          </div>
        );
      case Status.Success:
        return (
          <div>
            <p>Email has been verified. YOu can now log in.</p>
            <Button
              primary
              size="huge"
              onClick={() => modalStore.openModal(<LoginForm></LoginForm>)}
            >
              Log In
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  console.log('confirm email render', status);

  return (
    <Segment placeholder textAlign="center">
      <Header icon>
        <Icon name="envelope"></Icon>
        Email Verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
}
