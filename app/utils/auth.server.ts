import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/utils/session.server";
import type { User } from "./types.server";
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);
