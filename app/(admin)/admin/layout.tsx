import Layout from "@/shared/components/Layout";
import { Children } from "@/shared/types/children";

export default function layout({ children }: Children) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
