import { Header } from "@/components/shared/Header";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
