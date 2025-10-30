import { Extension } from '@tiptap/core';
import createRowResizePlugin from './RowResize';

const RowResizeExtension = Extension.create({
  name: 'rowResizeExtension',
  addProseMirrorPlugins() {
    return [createRowResizePlugin()];
  },
});

export default RowResizeExtension;


