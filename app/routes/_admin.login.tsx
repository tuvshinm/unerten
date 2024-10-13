import { Form } from "@remix-run/react";
export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-black">
      <div className="flex flex-col gap-1 w-72 h-24 justfiy-center items-center">
        <h1>welcome back.</h1>
        <Form method="post" className="flex flex-col">
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
          <button>login</button>
        </Form>
      </div>
    </div>
  );
}
