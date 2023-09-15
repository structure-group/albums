import Foco from "react-foco";
export default function AddPhoto({ setAddPhoto }) {
    return (
        <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.25)] w-full h-full flex flex-col items-center justify-center">
            <Foco onClickOutside={() => setAddPhoto(false)}>
                <div className="bg-white rounded-xl w-[600px] h-[400px] flex flex-col items-center justify-center z-10">
                    <p className="font-semibold text-2xl">Add Photo</p>
                </div>
            </Foco>
        </div>
    )
}