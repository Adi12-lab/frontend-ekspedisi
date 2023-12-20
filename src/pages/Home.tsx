import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import AnimationWrapper from "@/components/layout/page-animation";

function Home() {
  const {
    userAuth: { accessToken, email, roles, username }
  } = useContext(UserContext);

  return (
    accessToken === null ? <Navigate to="/login" /> : 
    (<AnimationWrapper keyValue={"home"}>
      <div>
        <h1 className="font-bold text-3xl">Selamat datang {roles && (roles[0] === "ROLE_USER") ? username : "Admin"}</h1>

        <div className="mt-4 flex flex-col gap-y-2">
          <p>
            <strong>Akses Token</strong> :{" "}
            <span className="block w-[60%] whitespace-normal">{accessToken}</span>
          </p>
          <p>
            <strong>Email</strong> :{" "}
            <span className="block w-[200px]">{email}</span>
          </p>
          <p>
            <strong>Username</strong> :{" "}
            <span className="block w-[200px]">{username}</span>
          </p>
          <p>
            <strong>Roles</strong> :{" "}
            <span className="block w-[200px]">{roles && roles[0]}</span>
          </p>
        </div>
      </div>
    </AnimationWrapper>)
  );
}

export default Home;
