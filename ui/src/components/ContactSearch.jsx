import { useState } from "react";
import ob from "urbit-ob";
import Contact from "./Contact";
import { deSig } from "@urbit/api";
export default function ContactSearch({
    contacts,
    group,
    disabledNicknames,
    disabledAvatars,
    selectedMembers,
    setSelectedMembers,
}) {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const groupMembers = group.map((member) => member[0]);
    const isInGroup = groupMembers.some((e) => deSig(e) === deSig(searchQuery));
    const search = Object.entries(contacts.data || {}).filter(
        ([ship, contact]) =>
            !isInGroup &&
            searchQuery !== "" &&
            (ship.includes(searchQuery) || contact?.nickname?.includes(searchQuery)),
    );
    return (
        <div className="w-full">
            <input
                type="text"
                className="p-2 w-full text-sm bg-indigo-white rounded-md relative focus:outline-indigo-gray"
                placeholder="Search for people to invite to album..."
                onFocus={() => setShowSearch(true)}
                onBlur={() => setShowSearch(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !isInGroup &&
                        ob.isValidPatp(`~${deSig(searchQuery)}`) &&
                        !selectedMembers.includes(`~${deSig(searchQuery)}`)
                    ) {
                        setSelectedMembers((prev) => [...prev, `~${deSig(searchQuery)}`]);
                        setSearchQuery("");
                    }
                }}
                value={searchQuery}
            />
            {showSearch && (
                <div className="absolute flex flex-col w-full p-4 border border-indigo-gray max-h-16 overflow-y-auto bg-white rounded-md">
                    {search.map(([ship, contact]) => {
                        return (
                            <div key={ship} className="w-full z-20 bg-purple-50">
                                <Contact
                                    ship={ship}
                                    contact={contact}
                                    disabledNicknames={disabledNicknames}
                                    disabledAvatars={disabledAvatars}
                                    className="hover:bg-indigo-white"
                                    onMouseDown={(e) => {
                                        if (!selectedMembers.includes(ship)) {
                                            e.preventDefault();
                                            setSelectedMembers((prev) => [...prev, [ship, false]]);
                                            setSearchQuery("");
                                            setShowSearch(false);
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
                    {search.length === 0 &&
                        !isInGroup &&
                        ob.isValidPatp(`~${deSig(searchQuery)}`) && (
                            <Contact
                                ship={`~${deSig(searchQuery)}`}
                                disabledNicknames={disabledNicknames}
                                disabledAvatars={disabledAvatars}
                                className="hover:bg-indigo-gray"
                                onMouseDown={(e) => {
                                    if (!selectedMembers.some((e) => e[0] === `~${deSig(searchQuery)}`)) {
                                        e.preventDefault();
                                        setSelectedMembers((prev) => [
                                            ...prev,
                                            [`~${deSig(searchQuery)}`, false],
                                        ]);
                                        setSearchQuery("");
                                        setShowSearch(false);
                                    }
                                }}
                            />
                        )}
                    {((search.length === 0 &&
                        searchQuery !== "" &&
                        !ob.isValidPatp(`~${deSig(searchQuery)}`)) ||
                        isInGroup) && (
                            <p className="text-sm text-gray-400 text-center">No results</p>
                        )}
                </div>
            )}
        </div>
    );
}
