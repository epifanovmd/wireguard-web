import { CollapseContent } from "./CollapseContent";
import { CollapseRoot } from "./CollapseRoot";
import { CollapseTrigger } from "./CollapseTrigger";

export { type CollapseContentProps } from "./CollapseContent";
export { type CollapseProps } from "./CollapseRoot";
export { type CollapseTriggerProps } from "./CollapseTrigger";

export const Collapse = Object.assign(CollapseRoot, {
  Trigger: CollapseTrigger,
  Content: CollapseContent,
});
