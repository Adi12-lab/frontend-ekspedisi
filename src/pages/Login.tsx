import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { storeSession } from "@/actions/session";
import ServiceAuth from "@/actions/auth";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Payload } from "@/types";
import AnimationWrapper from "@/components/layout/page-animation";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Payload>();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const {
    userAuth: { accessToken },
    setUserAuth,
  } = useContext(UserContext);

  const onSubmit: SubmitHandler<Payload> = async (payload) => {
    setLoading(true);
    try {
      const { data } = await ServiceAuth.login(payload);
      setUserAuth(data);
      storeSession("user", JSON.stringify(data));
    } catch (err) {
      toast.error("Username / Password salah");
    }
    reset();
    setLoading(false);
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={"login"}>
      <div className="container h-screen flex items-center justify-center">
        <Toaster position="top-center" reverseOrder={false} />
        <form
          className="w-[450px] border-2 shadow-lg p-5 flex flex-col gap-y-5 rounded-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-3xl font-bold text-center mt-3">Login</h1>
          <div>
            <label htmlFor="username" className="ms-3">
              Username
            </label>
            <Input
              id="username"
              placeholder="Masukkan username anda"
              className="mt-4"
              {...register("username", {
                required: "Username dibutuhkan",
              })}
            />
            {errors.username && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.username.message}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="password" className="ms-3">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                placeholder="*************"
                className="mt-4"
                type={visible ? "text" : "password"}
                {...register("password", {
                  required: "Password dibutuhkan",
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                })}
              />
              <button
                className="absolute right-2 bottom-2.5"
                type="button"
                onClick={() => setVisible((state) => !state)}
              >
                {visible ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.password.message}
              </small>
            )}
          </div>
          {loading ? (
            <Button type="button" disabled>
              Logging..
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )}

          <p>
            Belum punya akun ?{" "}
            <Link
              to="/registrasi"
              className="font-semibold hover:text-blue-400"
            >
              Registrasi
            </Link>
          </p>
        </form>
      </div>
    </AnimationWrapper>
  );
};

export default Login;
