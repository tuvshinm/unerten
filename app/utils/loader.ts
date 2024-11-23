import { LoaderFunctionArgs } from "@remix-run/node";
import { AtoZBrands } from "~/utils/mongoUtils.server"; // Keep this in the server context
export async function loader({}: LoaderFunctionArgs) {
  const data = await AtoZBrands(); // Ensure this fetch works
  if (!data) {
    throw new Response("No data found", { status: 404 });
  }
  return data;
}
