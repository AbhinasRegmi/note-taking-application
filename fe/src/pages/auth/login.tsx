import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { Center } from "@/components/ui/center";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "@/constants/routes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-localStorage";

export function LoginPage() {
  return (
    <Center>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your details to access{" "}
              <strong>Note Taking Application</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </Center>
  );
}

async function LoginUser(data: { email: string; password: string }) {
  try {
    const response = await fetch(`${ROUTES.backend.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const body = await response.json();

    if (response.status == 401) {
      throw "Please enter correct credentials";
    }

    if (response.status === 201) {
      return {
        ok: true,
        token: body.token,
      };
    }

    if (response.status === 400) {
      throw "Please verify your account first.";
    }
  } catch (e) {
    throw e;
  }
}

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

function LoginForm() {
  const navigate = useNavigate();
  const [_, setSession] = useLocalStorage("note-taking-app-session-key", "");
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const mutation = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      if (data?.token) {
        setSession(data.token);
      }
      navigate("/");
      toast.success("User login successful.");
    },
    onError: (e) => {
      let error;
      if (typeof e === "string") {
        error = e;
      } else {
        error = "Please try again later";
      }
      toast.error("Uh Oh! Something went wrong", {
        description: error,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@lftechnology.com" {...field} />
              </FormControl>
              <FormDescription>Enter your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex justify-between items-center w-full">
                  <span>Password</span>
                  <Link
                    to={"/auth/forgot-password"}
                    className="text-xs underline"
                  >
                    Forgot password
                  </Link>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="**************"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter your secure password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={mutation.isPending} type="submit" className="w-full">
          Login
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={"/auth/signup"} className="underline font-semibold">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
