import { Form, useActionData } from "@remix-run/react";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  ActionFunctionArgs,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinaryUtils.server";
export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = composeUploadHandlers(async ({ name, data }) => {
    if (name !== "img") {
      return undefined;
    }
    const uploadedImage: any = await uploadImage(data);
    return uploadedImage.secure_url;
  }, createMemoryUploadHandler());

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSource = formData.get("img");
  const imgDescription = formData.get("description");

  if (!imgSource) {
    return json({
      error: "something is wrong",
    });
  }
  return json({
    imgSource,
    imgDescription,
  });
}

export function createFragrance() {
  const data = useActionData();
  return (
    <Form>
      <h1>name of fragrance</h1>
      <input type="text" name="name"></input>
      <h1>price of fragrance</h1>
      <input type="number" name="price"></input>
      <h1>image select</h1>
      <button id="upload_widget" className="cloudinary-button">
        Upload files
      </button>
    </Form>
  );
}
