import SignUpForm from '../modules/auth/components/SignUpForm';

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;

SignUpPage.getLayout = (page) => page;
