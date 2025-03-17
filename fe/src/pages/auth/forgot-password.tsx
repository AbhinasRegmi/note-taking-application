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
import { Link, useNavigate, useSearchParams } from "react-router";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [_, setLocalStorage] = useLocalStorage(
    "note-taking-app-session-key",
    ""
  );
  const [params, __] = useSearchParams();
  const token = params.get("token");
  const emessage = params.get("emessage");
  const smessage = params.get("smessage");

  useEffect(() => {
    if (token) {
      setLocalStorage(token);
      navigate("/");
    }

    if (emessage) {
      setTimeout(() => {
        toast.error("Uh! Oh something went wrong", {
          description: emessage,
        });
      }, 0);
    }

    if (smessage) {
      setTimeout(() => {
        toast.error("Success!", {
          description: smessage,
        })
      }, 0);
    }
  }, [token, emessage, smessage]);

  return (
    <Center>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to get one time login link for{" "}
              <strong>Note Taking Application</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </Center>
  );
}

const loginFormSchema = z.object({
  email: z.string().email(),
});

async function LoginUser(data: { email: string }) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/auth/send/sst?email=${data.email}`,
      {
        method: "GET",
      }
    );

    const body = await response.json();

    if (response.status === 200) {
      return {
        message: body.message,
      };
    }

    throw "Please try again";
  } catch (e) {
    if (typeof e === "string") {
      throw e;
    }

    throw "Please try again.";
  }
}

function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const mutation = useMutation({
    mutationFn: LoginUser,
    onSuccess: () => {
      form.reset({ email: "" });
      toast.success("Success!", {
        description: "Single Use Login link has been sent to the given email.",
      });
    },
    onError: (error: string) => {
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
        <Button type="submit" className="w-full">
          Send Login Link
        </Button>

        <div className="text-center text-sm">
          <Link to={"/auth/login"} className="underline font-semibold">
            Go to login ?
          </Link>
        </div>
      </form>
    </Form>
  );
}
