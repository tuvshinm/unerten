import { authenticator } from "~/utils/auth.server";
import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { mongodb } from "~/utils/db.server";
import { Brand, Fragrance } from "~/utils/types.server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  addBrand,
  addFragrance,
  deleteBrand,
  deleteFragrance,
  editFragrance,
} from "~/utils/mongoUtils.server";
import UploadWidget from "~/components/widget";
import { useEffect, useState } from "react";
import { getEnv } from "~/utils/envs.server";
import { ObjectId } from "mongodb";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
export async function loader({ request }: LoaderFunctionArgs) {
  // No idea if this is secure.
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (user) {
    const db = mongodb.db("unerten");
    const fragrancesCollection = db.collection<Fragrance>("fragrences");
    const brandsCollection = db.collection<Brand>("brands");
    let fragrances = await fragrancesCollection.find({}).toArray();
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
    // Fetch and search  brands(if applicable)
    let brands = await brandsCollection.find({}).toArray();
    return json({
      brands,
      fragrances: populatedFragrances,
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
    // TODO: make this a single line, if possible.
    const name = formData.get("name");
    const price = formData.get("price");
    const id = formData.get("fid");
    const brand = formData.get("brand");
    const img = formData.get("url");
    const volume = formData.get("vol");
    const desc = formData.get("desc");
    const gender = formData.get("gender");
    const intent = formData.get("intent") as string;
    if (intent === "logout") {
      await authenticator.logout(request, { redirectTo: "/login" });
    } else if (intent === "createPerfume") {
      addFragrance(brand?.toString(), name, price, img, volume, desc, gender);
      return null;
    } else if (intent === "createBrand") {
      const brandname = formData.get("brandname") as string;
      if (brandname.length > 0) {
        await addBrand(brandname);
        return json({ success: true, message: "Brand added." });
      } else {
        return json({ success: false, message: "Name should not be empty" });
      }
    } else if (intent === "deletePerfume") {
      await deleteFragrance(id);
      return json({ success: true, message: "Perfume deleted." });
    } else if (intent === "deleteBrand") {
      await deleteBrand(id);
      return json({ success: true, message: "Brand deleted." });
    } else if (intent === "editFragrance") {
      await editFragrance(id, name, price);
      return json({ success: true, message: "Perfume edited." });
    } else {
      return json({ success: false, message: "Unknown Intent." });
    }
  } else {
    return json({ success: false, message: "Unauthorized" });
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
  const { brands, fragrances, env } = useLoaderData<LoaderData>();
  const brandActionData = useActionData<typeof action>();
  useEffect(() => {
    if (brandActionData) {
      toast({
        description: brandActionData.message,
        variant: brandActionData.success ? "default" : "destructive",
      });
    }
  }, [brandActionData]);
  const [url, setUrl] = useState(
    "http://res.cloudinary.com/djo4oojlj/image/upload/v1730386221/n1ulg01maknzhhf8q1ny.jpg" //placeholder img
  );
  const [editUrl, setEditUrl] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [vol, setVol] = useState("");
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [editing, setEditing] = useState(false);
  function ifSearch() {
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
              <h1>{v.name}</h1>
              <h1>{v.price}</h1>
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
                <Dialog modal={false}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit the fragrance</DialogTitle>
                      <DialogDescription>edit it.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                          brand name
                        </Label>
                        <Autocomplete
                          className="w-52  rounded-lg"
                          defaultInputValue={v.brand}
                        >
                          {brands.map((v) => {
                            return (
                              <AutocompleteItem
                                key={v._id}
                                value={v._id}
                                className="bg-white gap-0 border-2 border-black"
                                onClick={() => {
                                  setBrand(v._id);
                                }}
                              >
                                {v.name}
                              </AutocompleteItem>
                            );
                          })}
                        </Autocomplete>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-4 ">
                        <div className="flex flex-row justify-center items-center">
                          <div>
                            <Label htmlFor="name" className="text-right">
                              name
                            </Label>
                            <Input
                              className="col-span-3"
                              defaultValue={v.name}
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="price" className="text-right">
                              price
                            </Label>
                            <Input
                              id="price"
                              name="price"
                              className="col-span-3"
                              type="number"
                              defaultValue={v.price}
                              onChange={(e) => {
                                setPrice(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2">
                          <UploadWidget
                            onUpload={(error, result) => {
                              setEditUrl(result.info.url);
                              console.log(result);
                            }}
                            env={env}
                          >
                            {({ open }) => (
                              <button
                                onClick={open}
                                className=" bg-blue-500 text-white rounded-lg p-2"
                                id="img"
                              >
                                Upload an Image
                              </button>
                            )}
                          </UploadWidget>
                          <img
                            src={editUrl}
                            className="w-12 h-12 hover:w-24 hover:h-24 transition-all duration-150"
                          />
                        </div>

                        <Textarea
                          className="w-full"
                          rows={4}
                          placeholder="Description Here."
                          required
                          defaultValue={v.description}
                          onChange={(e) => {
                            setDesc(e.target.value);
                          }}
                          aria-label="description"
                        />
                        <div className="flex flex-row justify-center items-center">
                          <Select
                            name="gender"
                            onValueChange={(e) => {
                              setGender(e);
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a gender." />
                            </SelectTrigger>
                            <SelectContent defaultValue={v.gender}>
                              <SelectGroup>
                                <SelectItem value="0">masculine</SelectItem>
                                <SelectItem value="1">feminine</SelectItem>
                                <SelectItem value="2">unisex</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <div>
                            <Input
                              id="volume"
                              name="volume"
                              className="col-span-3"
                              type="number"
                              placeholder="volume of bottle in ml"
                              required
                              defaultValue={v.volume}
                              onChange={(e) => {
                                setVol(e.target.value);
                              }}
                              aria-label="volume of perfume"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Form
                        method="post"
                        action="/dashboard"
                        encType="multipart/form-data"
                        id="upload-form"
                      >
                        <input
                          type="text"
                          name="url"
                          hidden
                          id="url"
                          value={url}
                          readOnly
                        />
                        <input
                          type="text"
                          name="brand"
                          hidden
                          id="brand"
                          value={brand}
                          readOnly
                        />
                        <input
                          type="text"
                          name="name"
                          hidden
                          id="name"
                          value={name}
                          readOnly
                        />
                        <input
                          type="text"
                          name="gender"
                          hidden
                          id="gender"
                          value={gender}
                          readOnly
                        />
                        <input
                          type="number"
                          name="price"
                          hidden
                          id="price"
                          value={price}
                          readOnly
                        />
                        <input
                          type="text"
                          name="desc"
                          hidden
                          id="desc"
                          value={desc}
                          readOnly
                        />
                        <input
                          type="number"
                          name="vol"
                          hidden
                          id="vol"
                          value={vol}
                          readOnly
                        />
                        <button
                          type="submit"
                          name="intent"
                          value={"createPerfume"}
                          onClick={() => {
                            toast({
                              description: "Fragrance edited.",
                            });
                          }}
                        >
                          Save changes
                        </button>
                      </Form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Form>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-evenly items-center w-screen h-screen">
      <Form method="post" action="/dashboard">
        <button type="submit" name="intent" value={"logout"}>
          logout
        </button>
      </Form>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline">Create fragrence</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create fragrance</DialogTitle>
            <DialogDescription>Create a fragrance.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                brand name
              </Label>
              <Autocomplete className="w-52  rounded-lg">
                {brands.map((v) => {
                  return (
                    <AutocompleteItem
                      key={v._id}
                      value={v._id}
                      className="bg-white gap-0 border-2 border-black"
                      onClick={() => {
                        setBrand(v._id);
                      }}
                    >
                      {v.name}
                    </AutocompleteItem>
                  );
                })}
              </Autocomplete>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 ">
              <div className="flex flex-row justify-center items-center">
                <div>
                  <Label htmlFor="name" className="text-right">
                    name
                  </Label>
                  <Input
                    className="col-span-3"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-right">
                    price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    className="col-span-3"
                    type="number"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center items-center gap-2">
                <UploadWidget
                  onUpload={(error, result) => {
                    setUrl(result.info.url);
                    console.log(result);
                  }}
                  env={env}
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className=" bg-blue-500 text-white rounded-lg p-2"
                      id="img"
                    >
                      Upload an Image
                    </button>
                  )}
                </UploadWidget>
                <img
                  src={url}
                  className="w-12 h-12 hover:w-24 hover:h-24 transition-all duration-150"
                />
              </div>

              <Textarea
                className="w-full"
                rows={4}
                placeholder="Description Here."
                required
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                aria-label="description"
              />
              <div className="flex flex-row justify-center items-center">
                <Select
                  name="gender"
                  onValueChange={(e) => {
                    setGender(e);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a gender." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">masculine</SelectItem>
                      <SelectItem value="1">feminine</SelectItem>
                      <SelectItem value="2">unisex</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div>
                  <Input
                    id="volume"
                    name="volume"
                    className="col-span-3"
                    type="number"
                    placeholder="volume of bottle in ml"
                    required
                    onChange={(e) => {
                      setVol(e.target.value);
                    }}
                    aria-label="volume of perfume"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Form
              method="post"
              action="/dashboard"
              encType="multipart/form-data"
              id="upload-form"
            >
              <input
                type="text"
                name="url"
                hidden
                id="url"
                value={url}
                readOnly
              />
              <input
                type="text"
                name="brand"
                hidden
                id="brand"
                value={brand}
                readOnly
              />
              <input
                type="text"
                name="name"
                hidden
                id="name"
                value={name}
                readOnly
              />
              <input
                type="text"
                name="gender"
                hidden
                id="gender"
                value={gender}
                readOnly
              />
              <input
                type="number"
                name="price"
                hidden
                id="price"
                value={price}
                readOnly
              />
              <input
                type="text"
                name="desc"
                hidden
                id="desc"
                value={desc}
                readOnly
              />
              <input
                type="number"
                name="vol"
                hidden
                id="vol"
                value={vol}
                readOnly
              />
              <button
                type="submit"
                name="intent"
                value={"createPerfume"}
                onClick={() => {
                  toast({
                    description: "Fragrance added.",
                  });
                }}
              >
                Save changes
              </button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline">brandz</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>brand stuff</DialogTitle>
            <DialogDescription>
              Add a brand. delete a brand. whatever.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row">
            <Input
              type="text"
              id="brand1"
              required
              onChange={(e) => {
                setBrandName(e.target.value);
              }}
              placeholder="brand name"
            />
            <Form className="flex flex-col" method="post" action="/dashboard">
              <input
                type="text"
                name="brandname"
                hidden
                id="brandname"
                value={brandName}
                readOnly
                required
              />
              <Button type="submit" name="intent" value={"createBrand"}>
                Create
              </Button>
            </Form>
          </div>
          <div>
            <Label htmlFor="search" className="text-right">
              search brands
            </Label>
            <Input
              type="text"
              id="search"
              placeholder="search"
              className="pb-2"
              onChange={(e) => {
                setBrandSearch(e.target.value);
              }}
            />
            <div className="w-5/6 h-2/3 overflow-scroll">
              {brandSearch ? (
                <>
                  {brands
                    .filter((brand) =>
                      brand.name.toLowerCase().includes(brandSearch)
                    )
                    .map((brand) => (
                      <Form
                        key={brand._id.toString()}
                        className="flex flex-row gap-2"
                        method="post"
                        action="/dashboard"
                      >
                        <h1>{brand.name}</h1>
                        <input
                          name="fid"
                          type="text"
                          value={brand._id}
                          hidden
                        />
                        <Button
                          type="submit"
                          name="intent"
                          value={"deleteBrand"}
                          className="border-black rounded-full"
                        >
                          X
                        </Button>
                      </Form>
                    ))}
                </>
              ) : (
                <>
                  {brands.map((brand) => (
                    <Form
                      key={brand._id.toString()}
                      className="flex flex-row gap-2"
                      method="post"
                      action="/dashboard"
                    >
                      <h1>{brand.name}</h1>
                      <input name="fid" type="text" value={brand._id} hidden />
                      <Button
                        type="submit"
                        name="intent"
                        value={"deleteBrand"}
                        className="border-black rounded-full"
                      >
                        X
                      </Button>
                    </Form>
                  ))}
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline">edit fragrances</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit the fragrance</DialogTitle>
            <DialogDescription>edit it.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
        <div className="flex flex-row gap-2 h-2/3 overflow-scroll">
          {ifSearch()}
        </div>
      </div>
      <script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        type="text/javascript"
      ></script>
    </div>
  );
}
