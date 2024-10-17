const fakedata = [
  {
    name: "Empty Wishes well", //
    brand: "Toskovat", // this will be supplemented with a category ID from the database.
    image:
      "https://www.toskovat.com/wp-content/uploads/2023/10/Empty-Wishes-Well.jpg",
    price: 300,
    stock: 1,
  },
  {
    name: "Empty Wishes well", //
    brand: "Toskovat", // this will be supplemented with a category ID from the database.
    image:
      "https://www.toskovat.com/wp-content/uploads/2023/10/Empty-Wishes-Well.jpg",
    price: 300,
    stock: 1,
  },
  {
    name: "Empty Wishes well", //
    brand: "Toskovat", // this will be supplemented with a category ID from the database.
    image:
      "https://www.toskovat.com/wp-content/uploads/2023/10/Empty-Wishes-Well.jpg",
    price: 300,
    stock: 0,
  },
];
export default function () {
  {
    return (
      <div className="w-fit">
        <div className="grid grid-rows-4 grid-cols-4">
          {fakedata.map((v, index) => {
            if (v.stock > 0) {
              return (
                <div key={index} className="container">
                  <img src={v.image} className="image" />
                  <div className="overlay">
                    <div className="text flex flex-col justify-center items-center">
                      <h1 className="text-2xl">{v.brand}</h1>
                      <h1 className="text-4xl">{v.name}</h1>
                      <h1 className="text-2xl">{v.price}₮</h1>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
