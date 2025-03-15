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

export function SignupPage() {
  return (
    <Center>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>
              Enter your details to create account for{" "}
              <strong>Note Taking Application</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </Center>
  );
}

const SignupFormSchema = z
  .object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "The passwords do not match",
    path: ["passwordConfirm"],
  });

async function SignupUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${ROUTES.backend.baseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.username,
      }),
    });

    if (response.status === 201) {
      return {
        ok: true,
      }
    }
    
    const error = await response.json();
    throw error;

  } catch (e) {
    console.log(e);
    throw e;
  }
}

function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
  });

  const mutation = useMutation({
    mutationFn: SignupUser,
    onSuccess: () => {
      toast.success("User signup successfull.", {
        description: "An email verification link has been sent.",
      });
      navigate('/auth/login');
    },
    onError: () => {
      toast.error("User cannot be created", {
        description: "Please try again with different email.",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate({ ...data }))}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="froggy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@lftechnology.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="**************" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="**************" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={mutation.isPending} type="submit" className="w-full">
          Signup
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="underline font-semibold">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
