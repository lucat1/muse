import * as React from "react"
export { Root, Trigger, Portal, Group } from "@radix-ui/react-context-menu"
import {
  Item as ContextItem,
  ContextMenuItemProps,
  Content as ContextContent,
  ContextMenuContentProps,
  Separator as ContextSeparator,
  ContextMenuSeparatorProps,
  ItemIndicator as ContextItemIndicator,
  ContextMenuItemIndicatorProps
} from "@radix-ui/react-context-menu"

export const Content = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>((props, ref) => (
  <ContextContent
    {...props}
    ref={ref}
    style={props.style}
    className={`w-64 py-3 rounded-lg drop-shadow-xl bg-neutral-200 dark:bg-neutral-700 ${
      props.className || ""
    }`}
  />
))

export const Item: React.FC<
  ContextMenuItemProps & React.RefAttributes<HTMLDivElement>
> = (props) => (
  <ContextItem
    {...props}
    className={`relative flex flex-row items-center h-9 pl-16 pr-4 py-1 cursor-default focus:outline-none focus:bg-red-500 dark:focus:bg-red-400 focus:text-neutral-100 ${
      props.className || ""
    }`}
  />
)

const LEFT_CLASS =
  "absolute left-0 top-0 w-14 h-9 px-4 py-1 inline-flex justify-center items-center"
export const ItemIcon: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = (props) => (
  <div {...props} className={`${LEFT_CLASS} ${props.className || ""}`} />
)
export const ITEM_ICON_CLASS = "h-8 w-8"

export const ItemIndicator: React.FC<
  ContextMenuItemIndicatorProps & React.RefAttributes<HTMLDivElement>
> = (props) => (
  <ContextItemIndicator
    {...props}
    className={`${LEFT_CLASS} ${props.className || ""}`}
  />
)

export const Separator: React.FC<
  ContextMenuSeparatorProps & React.RefAttributes<HTMLDivElement>
> = (props) => (
  <ContextSeparator
    {...props}
    className={`h-px my-2 w-full bg-neutral-900 dark:bg-neutral-100 ${
      props.className || ""
    }`}
  />
)
