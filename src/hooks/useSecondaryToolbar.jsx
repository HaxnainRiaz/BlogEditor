import { useMemo } from 'react';
import { toolbarConfig, iconMap } from '../config/toolbarConfig';

export const useSecondaryToolbar = (editor, showToast) => {
  const secondaryItems = useMemo(() => {
    return toolbarConfig
      .filter(item => item.category === 'secondary')
      .map(item => ({
        ...item,
        onClick: () => item.onClick(editor, showToast, {
          onFullscreenToggle: () => document.dispatchEvent(new CustomEvent('toggle-fullscreen')),
          onCommentAdd: () => document.dispatchEvent(new CustomEvent('open-comment-modal')),
          onEquationInsert: () => document.dispatchEvent(new CustomEvent('open-equation-modal')),
          onTrackChanges: () => document.dispatchEvent(new CustomEvent('toggle-track-changes')),
        })
      }));
  }, [editor, showToast]);

  const fonts = [
    { label: "Inter", value: "Inter, system-ui, Arial" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Mono", value: "Courier New, monospace" },
  ];

  const fontSizes = [12, 14, 16, 18, 20, 24, 32];

  const isActive = (key) => {
    // Add active state logic for secondary items if needed
    return false;
  };

  const IconFor = (key) => {
    return iconMap[key] || null;
  };

  return {
    secondaryItems,
    fonts,
    fontSizes,
    isActive,
    IconFor
  };
};