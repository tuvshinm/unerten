import { Form } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { loginUser } from "~/utils/mongoUtils.server";
import { User } from "~/utils/types.server";
export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-black">
      <div className="flex flex-col gap-1 w-72 h-24 justfiy-center items-center">
        <h1>welcome back.</h1>
        <Form method="post" action="/login" className="flex flex-col">
          <input
            type="text"
            name="username"
            className="border-black border-[1px]"
            placeholder="username"
          ></input>
          <input
            type="password"
            name="password"
            className="border-black border-[1px]"
            placeholder="password"
          ></input>
          <button type="submit">login</button>
        </Form>
      </div>
    </div>
  );
}
export async function action({ context, request }: ActionFunctionArgs) {
  console.log("sent");
  authenticator.use(
    new FormStrategy<User>(async ({ form }) => {
      let username = form.get("username");
      let password = form.get("password");
      invariant(typeof username === "string", "username must be a string");
      invariant(
        username.length >= 4,
        "username must be more then or equal to 4 characters long."
      );
      invariant(
        username.length <= 12,
        "username must be less then or equal to 12 characters long."
      );
      invariant(typeof password === "string", "password must be a string");
      invariant(
        password.length > 8,
        "password must not be less then 8 characters long."
      );
      let user = await loginUser(username, password);
      if (!user) {
        console.log("fa");
        throw new Error("Invalid username or password");
      } else {
        console.log("worked");
        return user;
      }
    })
  );
  return await authenticator.authenticate("form", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    context, // optional
  });
}
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}
