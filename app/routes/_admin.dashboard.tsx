import { authenticator } from "~/utils/auth.server";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinaryUtils.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { mongodb } from "~/utils/db.server";
import { Brand, Fragrance } from "~/utils/types.server";
import { addBrand, addFragrance } from "~/utils/mongoUtils.server";
export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (user) {
    const db = await mongodb.db("unerten");
    const fragrancesCollection = db.collection<Fragrance>("fragrances");
    const brandsCollection = db.collection<Brand>("brands");

    const url = new URL(request.url);
    const fragSearch = url.searchParams.get("fragSearch");
    const brandSearch = url.searchParams.get("brandSearch");

    // Fetch fragrances (without populated brands)
    let fragrances = await fragrancesCollection.find({}).limit(10).toArray();

    // Populate brands for each fragrance
    const populatedFragrances = await Promise.all(
      fragrances.map(async (fragrance) => {
        const brand = await brandsCollection.findOne({
          ObjectId: fragrance.brand, // use the ObjectId directly
        });
        return {
          ...fragrance,
          brand: brand ? brand.title : null, // Here, brand is now a string
        };
      })
    );

    // Perform fragrance search
    let searchedFragrances: Fragrance[] = [];
    if (fragSearch) {
      const searchRegex = new RegExp(fragSearch, "i");
      searchedFragrances = await fragrancesCollection
        .find({ title: { $regex: searchRegex } })
        .limit(10)
        .toArray();

      // Populate brands for the searched fragrances
      searchedFragrances = await Promise.all(
        searchedFragrances.map(async (fragrance) => {
          const brand = await brandsCollection.findOne({
            ObjectId: fragrance.brand,
          });
          return {
            ...fragrance,
            brand: brand ? brand.title : null,
          };
        })
      );
    }

    // Fetch and search brands (if applicable)
    let brands = await brandsCollection.find({}).toArray();
    let searchedBrands: Brand[] = [];
    if (brandSearch) {
      const searchRegex = new RegExp(brandSearch, "i");
      searchedBrands = await brandsCollection
        .find({ title: { $regex: searchRegex } })
        .limit(10)
        .toArray();
    }
    return json({
      brands,
      searchedBrands,
      fragrances: populatedFragrances,
      searchedFragrances,
    });
  }
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const price = formData.get("price");
  const brand = formData.get("brand");
  const intent = formData.get("intent") as string;
  if (intent === "logout") {
    await authenticator.logout(request, { redirectTo: "/login" });
  } else if (intent === "createPerfume") {
    const uploadHandler = composeUploadHandlers(async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage: any = await uploadImage(data);
      return uploadedImage.secure_url;
    }, createMemoryUploadHandler());
    const formData = await parseMultipartFormData(request, uploadHandler);
    const imgSource = formData.get("img");
    if (!imgSource) {
      return json({
        error: "something is wrong",
      });
    } else {
      addFragrance(brand?.toString(), name, price, imgSource);
    }
    return json({
      imgSource,
    });
  } else if (intent === "createBrand") {
    const brandname = formData.get("brandname");
    addBrand(brandname);
    return null;
  } else if (intent === "deletePerfume") {
  } else if (intent === "deleteBrand") {
  }
}
interface LoaderData {
  brands: Brand[];
  searchedBrands: Brand[];
  fragrances: Fragrance[];
  searchedFragrances: Fragrance[];
}

interface ActionData {
  errorMsg?: string;
  imgSource?: string;
}

export default function Dashboard() {
  const { brands, searchedBrands, fragrances, searchedFragrances } =
    useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();

  return (
    <div className="flex flex-row justify-evenly items-center w-screen h-screen">
      <Form method="post" action="/dashboard">
        <button type="submit" name="intent" value={"logout"}>
          logout
        </button>
      </Form>

      <Form
        method="post"
        action="/dashboard"
        encType="multipart/form-data"
        id="upload-form"
      >
        <h1>Brand of Fragrance</h1>
        <select id="brand" name="brand" className="border-2 border-black">
          {brands.map((brand) => (
            <option key={brand._id.toString()} value={brand._id.toString()}>
              {brand.title}
            </option>
          ))}
        </select>

        <h1>Name of Fragrance</h1>
        <input type="text" name="name" className="border-2 border-black" />
        <h1>Price of Fragrance</h1>
        <input type="number" name="price" className="border-2 border-black" />
        <h1>Image Select</h1>
        <input id="img" type="file" name="img" accept="image/*" />
        <div>
          {data?.errorMsg && <h3>{data.errorMsg}</h3>}
          {data?.imgSource && (
            <>
              <h2>Uploaded Image: </h2>
              <img src={data.imgSource} />
            </>
          )}
        </div>
        <button type="submit" name="intent" value={"createPerfume"}>
          Create
        </button>
      </Form>
      <Form className="flex flex-col" method="post" action="/dashboard">
        <input
          type="text"
          name="brandname"
          placeholder="brand name here."
          className="border-2 border-black"
        />
        <button type="submit" name="intent" value={"createBrand"}>
          create brand.
        </button>
      </Form>
      <div>
        <Form>
          <input
            type="text"
            name="search"
            placeholder="Name of fragrance"
            className="border-2 border-black"
          />
          <button type="submit">Search</button>
        </Form>
        {fragrances.map((v, index) => (
          <div key={v._id.toString()} className="flex flex-row">
            <img src={v.img} className="image" alt={v.name} />{" "}
            {/* Ensure img property is correct */}
            <div className="flex flex-row justify-center items-center">
              <h1 className="text-2xl">{v.brand}</h1>{" "}
              {/* Use string title instead of object */}
              <h1 className="text-4xl">{v.name}</h1>
              <h1 className="text-2xl">{v.price}₮</h1>
              <button>delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
