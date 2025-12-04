import { Header } from "@/components/shared/Header";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default PublicLayout;
