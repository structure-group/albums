import { Sigil } from "./Sigil"
export default function Contact({ ship, contact, disabledNicknames, disabledAvatars }) {
    console.log(disabledAvatars)
    return (
        <div className="flex space-x-2 items-center w-full">
            {!disabledAvatars && contact?.avatar ? (
                <img src={contact.avatar} className="h-8 w-8 rounded-sm" />
            )
                : <Sigil
                    ship={ship}
                    background="#000000"
                    foreground="#ffffff"
                />
            }
            <p className="font-semibold max-w-sm truncate min-w-0">
                {!disabledNicknames && contact?.nickname ? contact.nickname : ship}
            </p>
        </div>
    )
}