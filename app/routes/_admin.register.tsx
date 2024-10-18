// import { Form } from "@remix-run/react";
// import { FormStrategy } from "remix-auth-form";
// import invariant from "tiny-invariant";
// import { authenticator } from "~/utils/auth.server";
// import { hash } from "~/utils/bcryptUtils.server";
// import { findOrCreateUser } from "~/utils/mongoUtils.server";
// import type { ActionFunctionArgs } from "@remix-run/node";
export default function Register() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-black">
      <div className="flex flex-col gap-1 w-72 h-24 justfiy-center items-center">
        <h1>registration is closed.</h1>
        {/* <Form method="post" action="/register" className="flex flex-col">
          <input
            type="text"
            name="username"
            className="border-black border-[1px]"
            placeholder="username"
            minLength={4}
            maxLength={12}
            required
          ></input>
          <input
            type="password"
            name="password"
            className="border-black border-[1px]"
            placeholder="password"
            minLength={8}
            required
          ></input>
          <button type="submit">register</button>
        </Form> */}
      </div>
    </div>
  );
}
// export async function action({ context, request }: ActionFunctionArgs) {
//   authenticator.use(
//     new FormStrategy(async ({ form }) => {
//       let username = form.get("username");
//       let password = form.get("password");
//       invariant(typeof username === "string", "username must be a string");
//       invariant(
//         username.length >= 4,
//         "username must be more then or equal to 4 characters long."
//       );
//       invariant(
//         username.length <= 12,
//         "username must be less then or equal to 12 characters long."
//       );
//       invariant(typeof password === "string", "password must be a string");
//       invariant(
//         password.length > 0,
//         "password must not be less then 8 characters long."
//       );
//       let hashedPassword = await hash(password);
//       let user = await findOrCreateUser(username, hashedPassword);
//       return user;
//     })
//   );
//   return await authenticator.authenticate("form", request, {
//     successRedirect: "/login",
//     failureRedirect: "/register",
//     //errors go as follows
//     context, // optional
//   });
// }
