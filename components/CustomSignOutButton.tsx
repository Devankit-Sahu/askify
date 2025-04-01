import { SignOutButton } from "@clerk/nextjs";

const CustomSignOutButton = () => {
  return <SignOutButton redirectUrl="/sign-in" />;
};

export default CustomSignOutButton;
