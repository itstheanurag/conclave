import LandingLayout from "../landing/layout";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingLayout>{children}</LandingLayout>;
}
