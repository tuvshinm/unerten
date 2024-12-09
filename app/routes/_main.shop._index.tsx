import { json, LoaderFunctionArgs } from "@remix-run/node";
import { mongodb } from "~/utils/db.server";
import { Brand, Fragrance } from "~/utils/types.server";
import { ObjectId } from "mongodb";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
export async function loader({ request }: LoaderFunctionArgs) {
  const db = await mongodb.db("unerten");
  const fragrancesCollection = db.collection<Fragrance>("fragrences");
  const brandsCollection = db.collection<Brand>("brands");
  const url = new URL(request.url);
  const fragSearch = url.searchParams.get("fragSearch");
  const brand = url.searchParams.get("brand");
  let fragrances = await fragrancesCollection.find({}).limit(10).toArray();
  const populatedFragrances = await Promise.all(
    fragrances.map(async (fragrance) => {
      const brand = await brandsCollection.findOne({
        _id: new ObjectId(fragrance.brand),
      });
      return {
        ...fragrance,
        brand: brand ? brand.name : null,
      };
    })
  );
  // search for the perfuems
  let searchedFragrances: Fragrance[] = [];
  if (fragSearch && brand) {
    const searchRegex = new RegExp(fragSearch, "i");
    searchedFragrances = await fragrancesCollection
      .find({ name: { $regex: searchRegex }, brand: new ObjectId(id) })
      .limit(12)
      .toArray();

    // populate em
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
  let brands = await brandsCollection.find({}).toArray();
  return json({
    brands,
    fragrances: populatedFragrances,
    searchedFragrances,
  });
}
interface LoaderData {
  brands: Brand[];
  fragrances: Fragrance[];
  searchedFragrances: Fragrance[];
}
export default function Shop() {
  const { fragrances, searchedFragrances } = useLoaderData<LoaderData>();
  function fart() {
    if (searchedFragrances.length > 0) {
      return searchedFragrances;
    } else {
      return fragrances;
    }
  }
  function number(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="grid grid-cols-4 w-3/4">
        {fart().map((v, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full p-2"
            >
              <div
                className=" transition-all justify-center items-center relative"
                onMouseOver={() => {
                  document
                    .getElementById(v._id + "_show")
                    ?.classList.remove("hidden");
                  document
                    .getElementById(v._id + "_img")
                    ?.classList.add("brightness-50");
                }}
                onMouseOut={() => {
                  document
                    .getElementById(v._id + "_show")
                    ?.classList.add("hidden");
                  document
                    .getElementById(v._id + "_img")
                    ?.classList.remove("brightness-50");
                }}
              >
                <img
                  src={v.img}
                  id={v._id + "_img"}
                  className="transition-all"
                />
                <Button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden"
                  id={v._id + "_show"}
                >
                  Detailed View.
                </Button>
              </div>
              <h1 className="text-2xl">{v.name}</h1>
              <h1>{number(v.price)}₮</h1>
            </div>
          );
        })}
      </div>
      <Button>View more?</Button>
    </div>
  );
}
