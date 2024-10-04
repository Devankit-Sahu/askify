import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <section className="sign-in flex items-center justify-center min-h-screen">
      <SignIn />
    </section>
  );
};

export default SignInPage;
