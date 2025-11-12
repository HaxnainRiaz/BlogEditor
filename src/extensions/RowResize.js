import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// Simple Row Resize plugin for ProseMirror tables used by TipTap
// Adds a bottom-edge handle per table row to drag and set fixed row height (in px)

export const rowResizePluginKey = new PluginKey('rowResize');

function getAllCellsInRow(trNode) {
  const cells = [];
  trNode.forEach((cell, offset) => {
    if (cell.type.name === 'tableCell' || cell.type.name === 'tableHeader') {
      cells.push({ node: cell, offset });
    }
  });
  return cells;
}

function mapRowCellsToDocPositions(tablePos, rowIndex, state) {
  // Compute positions of all cells in the row given the table position
  const table = state.doc.nodeAt(tablePos);
  if (!table) return [];
  let pos = tablePos + 1; // inside table
  let foundRowStart = null;
  for (let r = 0; r < table.childCount; r++) {
    const row = table.child(r);
    if (r === rowIndex) {
      foundRowStart = pos;
      break;
    }
    pos += row.nodeSize;
  }
  if (foundRowStart == null) return [];
  const rowNode = table.child(rowIndex);
  const cells = [];
  let cellPos = foundRowStart + 1; // inside row
  rowNode.forEach((cell) => {
    cells.push(cellPos);
    cellPos += cell.nodeSize;
  });
  return cells;
}

export default function createRowResizePlugin() {
  return new Plugin({
    key: rowResizePluginKey,
    state: {
      init: (_config, state) => buildRowHandles(state),
      apply(tr, old, _oldState, newState) {
        // Rebuild decorations only when the document changes
        if (!tr.docChanged) return old;
        return buildRowHandles(newState);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
      handleDOMEvents: {
        mousedown(view, event) {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return false;
          const handle = target.closest('.row-resize-handle');
          if (!handle) return false;

          event.preventDefault();
          const rowIndex = parseInt(handle.getAttribute('data-row-index') || '-1', 10);
          const tablePos = parseInt(handle.getAttribute('data-table-pos') || '-1', 10);
          if (rowIndex < 0 || tablePos < 0) return false;

          const startY = event.clientY;
          const { state } = view;
          const table = state.doc.nodeAt(tablePos);
          if (!table) return false;
          let startHeight = 0;
          // Determine current row height from first cell style if present
          const cellsDocPositions = mapRowCellsToDocPositions(tablePos, rowIndex, state);
          if (cellsDocPositions.length) {
            const dom = view.nodeDOM(cellsDocPositions[0]);
            if (dom && dom instanceof HTMLElement) {
              const rect = dom.getBoundingClientRect();
              startHeight = rect.height;
            }
          }

          const onMove = (e) => {
            const dy = e.clientY - startY;
            const newHeight = Math.max(16, Math.round(startHeight + dy));
            view.dispatch(
              view.state.tr.setMeta(rowResizePluginKey, { type: 'preview' })
            );
            // Apply as inline style height on each cell in the row
            const tr = view.state.tr;
            const tableNode = view.state.doc.nodeAt(tablePos);
            if (!tableNode) return;
            let rowStartPos = tablePos + 1;
            for (let r = 0; r < tableNode.childCount; r++) {
              const row = tableNode.child(r);
              if (r === rowIndex) {
                // update each cell attrs.style to include height
                let cellPos = rowStartPos + 1;
                row.forEach((cell, _o, i) => {
                  const prevStyle = cell.attrs.style || '';
                  const cleaned = prevStyle.replace(/height:\s*[^;]+;?/g, '').trim();
                  const nextStyle = `${cleaned} height: ${newHeight}px;`.trim();
                  tr.setNodeMarkup(cellPos, undefined, { ...cell.attrs, style: nextStyle });
                  cellPos += cell.nodeSize;
                });
                break;
              }
              rowStartPos += row.nodeSize;
            }
            view.dispatch(tr);
          };

          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            document.body.classList.remove('pm-row-resizing');
          };

          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
          document.body.classList.add('pm-row-resizing');
          return true;
        },
      },
    },
    // No view that dispatches transactions to avoid update loops
  });
}

function buildRowHandles(state) {
  const decorations = [];
  const { doc } = state;
  doc.descendants((node, pos) => {
    if (node.type.name === 'table') {
      const tablePos = pos;
      let rowPos = pos + 1;
      for (let r = 0; r < node.childCount; r++) {
        const row = node.child(r);
        // Attach a handle widget at the end of the first cell's content
        if (row.childCount > 0) {
          const cellPos = rowPos + 1; // position of first cell
          const handle = document.createElement('div');
          handle.className = 'row-resize-handle';
          handle.setAttribute('data-row-index', String(r));
          handle.setAttribute('data-table-pos', String(tablePos));
          const deco = Decoration.widget(cellPos + 1, handle, {
            side: 1,
            ignoreSelection: true,
          });
          decorations.push(deco);
        }
        rowPos += row.nodeSize;
      }
    }
  });
  return DecorationSet.create(doc, decorations);
}


