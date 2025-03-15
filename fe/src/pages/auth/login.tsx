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
import { Link } from "react-router";

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

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input placeholder="**************" {...field} />
              </FormControl>
              <FormDescription>Enter your secure password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
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
