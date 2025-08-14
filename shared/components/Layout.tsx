import Sidebar from "@/shared/components/Sidebar";
import { Children } from "../types/children";
import PageLoader from "./PageLoader";
import TopNav from "./TopNav";
export default function Layout({ children }: Children) {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <PageLoader />
      <div className="h-screen flex-1 overflow-y-auto relative">{children}</div>
    </div>
  );
}
