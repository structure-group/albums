import { Sigil } from "./Sigil";
import cn from "classnames";
export default function Contact({
  ship,
  contact,
  disabledNicknames,
  disabledAvatars,
  className = "",
  onMouseDown = () => {},
}) {
  return (
    <div
      className={cn("flex space-x-2 items-center w-full", className)}
      onMouseDown={onMouseDown}
    >
      {!disabledAvatars && contact?.avatar ? (
        <img src={contact.avatar} className="h-8 w-8 rounded-md" />
      ) : (
        <Sigil ship={ship} background="#000000" foreground="#ffffff" />
      )}
      <p className="font-semibold max-w-sm truncate min-w-0 text-sm">
        {!disabledNicknames && contact?.nickname ? contact.nickname : ship}
      </p>
    </div>
  );
}
