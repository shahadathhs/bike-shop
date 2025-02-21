import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";
import { redirect } from "react-router";

export const getToken = () => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  const parsedUser: IUser = JSON.parse(user);
  if (!parsedUser.token) {
    return redirect("/auth/login");
  }
  const token = parsedUser.token as string;
  return token;
};
