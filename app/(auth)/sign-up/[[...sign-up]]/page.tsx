import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <section className="sign-in flex items-center justify-center min-h-screen">
      <SignUp />
    </section>
  );
};

export default SignUpPage;
