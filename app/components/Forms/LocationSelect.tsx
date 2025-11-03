import type { SetStateAction } from "react"

export default function LocationSelect({setHideMenu}: {setHideMenu: React.Dispatch<SetStateAction<boolean>>}){
      const label = "From"
      const selectLabel = "pickup"
      return (
            <div className="flex border border-gray-200 rounded-lg mx-4 my-4 p-2 text-black items-center">
                  <p className="px-2">{label}:</p>
                  <p className="py-1 rounded-lg border border-gray-200 px-2 w-full text-center" onClick={() => setHideMenu(true)}>{`Select a ${selectLabel} location`}</p>
            </div>
      )
}