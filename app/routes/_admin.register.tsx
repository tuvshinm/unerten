import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { mongodb } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const db = await mongodb.db("unerten");
  const collection = await db.collection("user");
  const result = await collection.insertOne(user);
  return redirect(`/movies/${result.insertedId}`);
}
export default function Register() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-black">
      <div className="flex flex-col gap-1 w-72 h-24 justfiy-center items-center">
        <h1>welcome.</h1>
        <Form method="post" action="/register" className="flex flex-col">
          <input
            type="email"
            className="border-black border-[1px]"
            placeholder="username"
          ></input>
          <input
            type="password"
            className="border-black border-[1px]"
            placeholder="password"
          ></input>
          <button>register</button>
        </Form>
      </div>
    </div>
  );
}
