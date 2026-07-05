// TypeScript 5.0's dom lib removed DocumentAndElementEventHandlers (its
// members moved onto HTMLElement/GlobalEventHandlers), but hyperapp 2.0.22's
// bundled typings still subtract it from HTMLElement. An empty stand-in
// keeps the modern dom lib usable; nothing is lost in the subtraction since
// the handlers now live on the interfaces hyperapp already subtracts.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DocumentAndElementEventHandlers {}
