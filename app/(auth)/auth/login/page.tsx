import { LoginForm } from "@/modules/Employees/components/Login";
import RedirectIfAuthenticated from "@/shared/components/RedirectIfAuthenticated";

export default function page() {
  return (
    <RedirectIfAuthenticated>
      <LoginForm />;
    </RedirectIfAuthenticated>
  );
}
