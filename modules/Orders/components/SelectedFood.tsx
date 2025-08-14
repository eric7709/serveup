export default function SelectedFood() {
  return (
    <div className="fixed bg-white hidden  backdrop-blur-xl inset-0">
      <div className="h-full relative w-full flex flex-col bg-red-500">
        <div className="flex items-center justify-between p-3">
          <p className="text-xl font-semibold mb-2">Foods Added</p>
          <p>
            Total: <b>$500</b>
          </p>
        </div>
        <div className="flex-1 px-3 bg-purple-500">
          <div className=" flex flex-col gap-4 ">
            {/* {items.map((menuItem, key) => (
              <FoodItem key={key} menuItem={menuItem} />
            ))} */}
          </div>
        </div>
        <div className="flex p-3 bg-white gap-2">
          <button className="py-3.5 cursor-pointer duration-300 active:scale-90 rounded-md shadow-md font-semibold text-white text-sm flex-1 bg-red-500">
            Clear All
          </button>
          <button className="py-3.5 cursor-pointer duration-300 active:scale-90 rounded-md shadow-md font-semibold text-white text-sm flex-1 bg-emerald-500">
            Order
          </button>
        </div>
      </div>
    </div>
  );
}
