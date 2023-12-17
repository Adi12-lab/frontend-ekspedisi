import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";

import { Payload } from "@/types";

import { UserContext } from "@/App";
import ServiceAuth from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimationWrapper from "@/components/layout/page-animation";

const Register = () => {
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
  } = useContext(UserContext);

  const onSubmit: SubmitHandler<Payload> = async (data) => {
    setLoading(true);

    try {
      await ServiceAuth.register(data);
      toast.success(`Registrasi berhasil silahkan login`);
    } catch (err) {
      toast.error("Gagal registrasi");
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
          <h1 className="text-3xl font-bold text-center mt-3">Registrasi</h1>
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
                minLength: {
                  value: 4,
                  message: "Username minimal 4 karakter",
                },
              })}
            />
            {errors.username && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.username.message}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="email" className="ms-3">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email anda"
              className="mt-4"
              {...register("email", {
                required: "Email dibutuhkan",
              })}
            />
            {errors.email && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.email.message}
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
              Meregistrasi..
            </Button>
          ) : (
            <Button type="submit">Registrasi</Button>
          )}
          <p>
            Sudah punya akun ?{" "}
            <Link to="/login" className="font-semibold hover:text-blue-400">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AnimationWrapper>
  );
};

export default Register;
