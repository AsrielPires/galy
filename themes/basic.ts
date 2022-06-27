import { Styles } from "galho/css";
import { C, cc, HAlign, VAlign } from "galhui";
import { border } from "galhui/style";
import { Context } from "galhui/themes/basic";
import { LC } from "../galy";

export const stack = ({ brd }: Context): Styles => ({
  "._.stack": {
    height: "100%",
    display: "flex",
    hr: {
      flex: "0 0",
      border: "none",
    },
    "&.h": {
      hr: { borderLeft: border(brd,4), },
    },
    "&.v": {
      flexDirection: "column",
      hr: { borderTop: border(brd,4), },
    },
    "*": { margin: 0, borderRadius: 0 }
  },
});
export function item(ctx: Context): Styles {
  return {
    [cc(LC.item)]: {
      // ...col,
      ["." + C.head]: {
      }
    },
  }
}
export function galy(ctx: Context): Styles {
  ctx(stack)(item);
  return {
    "._.galy": {
      height: "100%",
      ["." + HAlign.left]: {

      },
      ["." + HAlign.right]: {

      },
      ["." + VAlign.bottom]: {

      },
    },
  }
}