import { authenticator } from "~/utils/auth.server";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { mongodb } from "~/utils/db.server";
import { Brand, Fragrance } from "~/utils/types.server";
import {
  addBrand,
  addFragrance,
  deleteBrand,
  deleteFragrance,
  editFragrance,
} from "~/utils/mongoUtils.server";
import UploadWidget from "~/components/widget";
import { useState } from "react";
import { getEnv } from "~/utils/envs.server";
import { ObjectId } from "mongodb";
export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (user) {
    const db = await mongodb.db("unerten");
    const fragrancesCollection = db.collection<Fragrance>("fragrences");
    const brandsCollection = db.collection<Brand>("brands");

    const url = new URL(request.url);
    const fragSearch = url.searchParams.get("fragSearch");
    const brandSearch = url.searchParams.get("brandSearch");
    let fragrances = await fragrancesCollection.find({}).limit(10).toArray();
    const populatedFragrances = await Promise.all(
      fragrances.map(async (fragrance) => {
        const brand = await brandsCollection.findOne({
          _id: new ObjectId(fragrance.brand),
        });
        return {
          ...fragrance,
          brand: brand ? brand.name : null, // Here, brand is now a string
        };
      })
    );

    // Perform fragrance search
    let searchedFragrances: Fragrance[] = [];
    if (fragSearch) {
      const searchRegex = new RegExp(fragSearch, "i");
      searchedFragrances = await fragrancesCollection
        .find({ name: { $regex: searchRegex } })
        .limit(10)
        .toArray();

      // Populate brands for the searched fragrances
      searchedFragrances = await Promise.all(
        searchedFragrances.map(async (fragrance) => {
          const brand = await brandsCollection.findOne({
            _id: new ObjectId(fragrance.brand),
          });
          return {
            ...fragrance,
            brand: brand ? brand.name : null,
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
        .find({ name: { $regex: searchRegex } })
        .limit(10)
        .toArray();
    }
    return json({
      brands,
      searchedBrands,
      fragrances: populatedFragrances,
      searchedFragrances,
      env: getEnv(),
    });
  }
}
export async function action({ request }: ActionFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (user) {
    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const id = formData.get("fid");
    const brand = formData.get("brand");
    const img = formData.get("url");
    const intent = formData.get("intent") as string;
    if (intent === "logout") {
      await authenticator.logout(request, { redirectTo: "/login" });
    } else if (intent === "createPerfume") {
      addFragrance(brand?.toString(), name, price, img);
      console.log("worked");
      return null;
    } else if (intent === "createBrand") {
      const brandname = formData.get("brandname");
      await addBrand(brandname);
      return null;
    } else if (intent === "deletePerfume") {
      await deleteFragrance(id);
      return null;
    } else if (intent === "deleteBrand") {
      await deleteBrand(id);
      return null;
    } else if (intent === "editFragrance") {
      await editFragrance(id, name, price);
      return null;
    }
    return null;
  } else {
    return null;
  }
}
interface LoaderData {
  brands: Brand[];
  searchedBrands: Brand[];
  fragrances: Fragrance[];
  searchedFragrances: Fragrance[];
  env: any;
}
export default function Dashboard() {
  const { brands, searchedBrands, fragrances, searchedFragrances, env } =
    useLoaderData<LoaderData>();
  const [url, setUrl] = useState("");
  function ifSearch() {
    if (searchedFragrances.length === 0) {
      return (
        <div className="overflow-scroll h-3/4 flex flex-col">
          <h1>all fragrances</h1>
          {fragrances.map((v) => (
            <Form
              key={v._id.toString()}
              className="flex flex-row gap-1"
              method="post"
              action="/dashboard"
            >
              <img src={v.img} className="size-10" alt={v.name} />
              <div className="flex flex-row justify-center items-center gap-3">
                <h1>{v.brand}</h1>
                <input name="name" type="text" defaultValue={v.name} />
                <input name="price" type="number" defaultValue={v.price} />
                <input name="fid" type="text" defaultValue={v._id} hidden />
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    name="intent"
                    value={"deletePerfume"}
                    className="border-2 border-black px-2"
                  >
                    delete
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value={"editFragrance"}
                    className="border-2 border-black px-2"
                  >
                    edit
                  </button>
                </div>
              </div>
            </Form>
          ))}
        </div>
      );
    } else {
      return (
        <div className="overflow-scroll h-3/4 flex flex-col ">
          <h1>searched fragrances:</h1>
          {searchedFragrances.map((v) => (
            <Form
              key={v._id.toString()}
              className="flex flex-row gap-1"
              method="post"
              action="/dashboard"
            >
              <img src={v.img} className="size-10" alt={v.name} />
              <div className="flex flex-row justify-center items-center gap-3">
                <h1>{v.brand}</h1>
                <input name="name" type="text" defaultValue={v.name} />
                <input name="price" type="number" defaultValue={v.price} />
                <input name="fid" type="text" defaultValue={v._id} hidden />
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    name="intent"
                    value={"deletePerfume"}
                    className="border-2 border-black px-2"
                  >
                    delete
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value={"editFragrance"}
                    className="border-2 border-black px-2"
                  >
                    edit
                  </button>
                </div>
              </div>
            </Form>
          ))}
        </div>
      );
    }
  }
  function ifBrandSearch() {
    if (searchedBrands.length === 0) {
      return (
        <div className="h-96 overflow-scroll ">
          {brands.map((brand) => (
            <Form
              key={brand._id.toString()}
              className="flex flex-row gap-2"
              method="post"
              action="/dashboard"
            >
              <h1>{brand.name}</h1>
              <input name="fid" type="text" defaultValue={brand._id} hidden />
              <button
                type="submit"
                name="intent"
                value={"deleteBrand"}
                className="border-2 border-black px-2"
              >
                X
              </button>
            </Form>
          ))}
        </div>
      );
    } else {
      return (
        <div className="h-96 overflow-scroll ">
          {searchedBrands.map((brand) => (
            <Form
              key={brand._id.toString()}
              className="flex flex-row gap-2"
              method="post"
              action="/dashboard"
            >
              <h1>{brand.name}</h1>
              <input name="fid" type="text" defaultValue={brand._id} hidden />
              <button
                type="submit"
                name="intent"
                value={"deleteBrand"}
                className="border-2 border-black px-2"
              >
                X
              </button>
            </Form>
          ))}
        </div>
      );
    }
  }
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
              {brand.name}
            </option>
          ))}
        </select>

        <h1>Name of Fragrance</h1>
        <input type="text" name="name" className="border-2 border-black" />
        <h1>Price of Fragrance</h1>
        <input type="number" name="price" className="border-2 border-black" />
        <h1>Image Select</h1>
        <UploadWidget
          onUpload={(error, result) => {
            setUrl(result.info.url);
            console.log(result);
          }}
          env={env}
        >
          {({ open }) => (
            <button onClick={open} className="pr-2">
              Upload an Image
            </button>
          )}
        </UploadWidget>
        <input type="text" name="url" hidden id="url" value={url} readOnly />
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
        <div className="flex flex-col gap-2">
          <Form>
            <input
              type="text"
              name="brandSearch"
              placeholder="Name of fragrance"
              className="border-2 border-black"
            />
            <button type="submit">Search</button>
          </Form>
          {ifBrandSearch()}
        </div>
      </Form>
      <div>
        <Form className="gap-2">
          <input
            type="text"
            name="fragSearch"
            placeholder="Name of fragrance"
            className="border-2 border-black"
          />
          <button type="submit">Search&nbsp;</button>
          <a href="/dashboard" className="border-2 border-black">
            X
          </a>
        </Form>
        <div id="error"></div>
        <div className="flex flex-row gap-2 h-full">{ifSearch()}</div>
      </div>
      <script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        type="text/javascript"
      ></script>
    </div>
  );
}
