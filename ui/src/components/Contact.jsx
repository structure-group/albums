import { Sigil } from "./Sigil";
import cn from "classnames";
export default function Contact({
  ship,
  contact,
  disableNicknames,
  disableAvatars,
  className = "",
  onMouseDown = () => {},
  size = 32,
}) {
  return (
    <div
      className={cn("flex space-x-2 items-center w-full", className)}
      onMouseDown={onMouseDown}
    >
      {!disableAvatars && contact?.avatar ? (
        <img
          src={contact.avatar}
          className="rounded-md"
          style={{ height: size, width: size }}
        />
      ) : (
        <Sigil
          size={size}
          ship={ship}
          background="#000000"
          foreground="#ffffff"
        />
      )}
      <p className="font-semibold max-w-sm truncate min-w-0 text-sm">
        {!disableNicknames && contact?.nickname ? contact.nickname : ship}
      </p>
    </div>
  );
}
