import Albums from "./Albums";
export default function NewAlbum() {
  return (
    <div className="flex w-full h-full">
      <div className="p-8 h-full bg-white basis-1/2 flex flex-col space-y-8 border-r-2 border-indigo-gray">
        <h2 className="font-semibold text-lg">New Album</h2>
        <div className="flex flex-col space-y-1">
          <h3 className="text-sm font-semibold">Album Title</h3>
          <input
            type="text"
            className="bg-indigo-white rounded-md p-1 text-sm"
            placeholder="My Great Photos"
          />
        </div>
        <div className="flex flex-col items-start space-y-1">
          <h3 className="text-sm font-semibold">Images</h3>
          <div className="bg-indigo-white rounded-md border-2 border-dashed border-indigo-gray w-full p-2">
            <button className="text-sm bg-[#333333] text-white font-semibold p-1 px-2 rounded-lg">
              Upload
            </button>
            {/* TODO incorporate into file store */}
            {/* TODO or drag and drop... */}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto basis-1/2">
        <Albums />
      </div>
    </div>
  );
}
