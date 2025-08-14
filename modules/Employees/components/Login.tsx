"use client";
import { Input } from "@/shared/components/Input";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useEmployeesServices";
import { toast } from "react-toastify";
import { Login } from "../types/employee";
import BitePointLogo from "@/shared/components/Logo";
import Loader from "@/shared/components/Loader";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>();
  const { data, mutate, isPending } = useLogin();

  const router = useRouter();

  const onSubmit = (form: { email: string; password: string }) => {
    mutate(form, {
      onSuccess: () => {
        toast.success("✅ Welcome to BitePoint!");
        router.push("/");
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 px-4">
      {!data ? (
        <div className="bg-orange-50 w-full max-w-sm rounded-xl shadow-md p-6 border border-orange-200">
          {/* Logo & Welcome */}
          <div className="flex flex-col items-center mb-5">
            <BitePointLogo />
            <h1 className="text-xl font-semibold mt-3 text-orange-900">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-600 text-center">
              Please sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message as string}
            />
            <Input
              label="Password"
              type="password"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message as string}
            />

            {/* Submit Button */}
            <button
              disabled={isPending}
              type="submit"
              className={`w-full h-11 rounded-lg font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 ${
                isPending
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-[10px] text-center text-gray-500 mt-5">
            &copy; {new Date().getFullYear()} BitePoint POS
          </p>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
