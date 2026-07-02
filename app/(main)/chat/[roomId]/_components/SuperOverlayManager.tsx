import { AnimatePresence } from "framer-motion";
import SuperILoveYouReaction from "../data/SuperILoveYouReaction";
import SuperIMissYouReaction from "../data/SuperIMissYouReaction";

const OVERLAY_MAP: Record<string, React.ComponentType<any>> = {
  SuperILoveYouReaction: SuperILoveYouReaction,
  SuperIMissYouReaction: SuperIMissYouReaction
};

export function SuperOverlayManager({ activeComponent, onClose, config, connectedUser }: any) {
  const ComponentToRender = activeComponent
    ? OVERLAY_MAP[activeComponent]
    : null;

  return (
    <AnimatePresence>
      {ComponentToRender && (
        <ComponentToRender onClose={onClose} config={config} connectedUser={connectedUser} />
      )}
    </AnimatePresence>
  );
}
