import { sigil, reactRenderer } from "@tlon/sigil-js";
import { deSig } from "@urbit/api";

export const Sigil = ({ ship, background, foreground, size = 32 }) => {
  if (ship.length > 14) {
    return <div />;
  }
  if (size === 24) {
    return (
      <div
        className="p-[6px] rounded-md"
        style={{ backgroundColor: background }}
      >
        {sigil({
          patp: deSig(ship) || "zod",
          renderer: reactRenderer,
          size: 12,
          icon: true,
          colors: [background, foreground],
          margin: true,
        })}
      </div>
    );
  }
  return (
    <div className="p-2 rounded-md" style={{ backgroundColor: background }}>
      {sigil({
        patp: deSig(ship) || "zod",
        renderer: reactRenderer,
        size: 16,
        icon: true,
        colors: [background, foreground],
        margin: true,
      })}
    </div>
  );
};
