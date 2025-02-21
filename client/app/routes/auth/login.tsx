import { useAuth } from "provider/auth/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useFetcher,
  useNavigate,
  type ClientActionFunctionArgs,
} from "react-router";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }

  if (typeof password !== "string" || !password.trim()) {
    return { error: "Password is required" };
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    return {
      success: true,
      message: "Login successful",
      user: data.data,
      data,
    };
  } else {
    console.error("Error logging in", data);
    return { error: data.message, errorDetails: data };
  }
};

export default function Login() {
  const fetcher = useFetcher();
  const user = fetcher.data?.user;
  const isSubmitting = fetcher.state === "submitting";

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetcherData = async () => {
      if (fetcher.data?.success) {
        toast.dismiss();
        toast.success(fetcher.data.message);

        // * login the user
        login(user);

        //* wait for 1 second before redirecting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (user.role === "admin") {
          navigate("/dashboard/admin");
        } else if (user.role === "customer") {
          navigate("/dashboard/customer");
        }
      } else if (fetcher.data?.error) {
        toast.dismiss();
        toast.error(fetcher.data.error);
      }
    };

    handleFetcherData();
  }, [fetcher.data, login, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <fetcher.Form method="post" className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="label mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="label mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </fetcher.Form>
      <div className="text-center mt-4">
        Don't have an account?{" "}
        <a href="/auth/register" className="link link-primary">
          Register here
        </a>
      </div>
    </div>
  );
}
