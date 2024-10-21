import { json, LoaderFunctionArgs } from "@remix-run/node";
import { mongodb } from "~/utils/db.server";
import { Brand, Fragrance } from "~/utils/types.server";
import { ObjectId } from "mongodb";
import { useLoaderData } from "@remix-run/react";
export async function loader({ request }: LoaderFunctionArgs) {
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
  const { brands, fragrances, searchedFragrances } =
    useLoaderData<LoaderData>();
  return (
    <div className="w-fit">
      <div className="grid grid-rows-4 grid-cols-4">
        {fragrances.map((v, index) => {
          return (
            <div key={index} className="container">
              <img src={v.img} className="image" />
              <div className="overlay">
                <div className="text flex flex-col justify-center items-center">
                  <h1 className="text-2xl">{v.brand}</h1>
                  <h1 className="text-4xl">{v.name}</h1>
                  <h1 className="text-2xl">{v.price}₮</h1>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
