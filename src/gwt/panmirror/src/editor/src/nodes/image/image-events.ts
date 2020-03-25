/*
 * image-events.ts
 *
 * Copyright (C) 2019-20 by RStudio, PBC
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

import { NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { findParentNodeClosestToPos } from 'prosemirror-utils';

export function imageDrop() {
  return (view: EditorView, event: Event) => {
    // alias to drag event so typescript knows about event.dataTransfer
    const dragEvent = event as DragEvent;

    // ensure we have data transfer
    if (!dragEvent.dataTransfer) {
      return false;
    }

    // ensure the drop coordinates map to an editor position
    const coordinates = view.posAtCoords({
      left: dragEvent.clientX,
      top: dragEvent.clientY,
    });
    if (!coordinates) {
      return false;
    }

    // see if this is a drag of image uris
    let uriList = dragEvent.dataTransfer.getData('text/uri-list');
    const html = dragEvent.dataTransfer.getData('text/html');
    if (!uriList || !html) {
      return false;
    }

    // see if we can pull an image out of the html
    const regex = /<img.*?src=["'](.*?)["']/;
    const match = regex.exec(html);
    if (!match) {
      return false;
    } else {
      uriList = match[1];
    }

    // indicate that we can handle this drop
    event.preventDefault();

    // see whether this is a figure or image drop (image if it's immediate parent is a text node)
    const schema = view.state.schema;
    let nodeType = schema.nodes.image;
   
    
    const dropNode = findParentNodeClosestToPos(view.state.doc.resolve(coordinates.pos), () => true);
    if (!dropNode || !dropNode.node.inlineContent) {
      nodeType = schema.nodes.figure;
    }

    // insert the images   
    uriList.split('\r?\n').forEach(src => {
      const node = nodeType.create({ src });
      const transaction = view.state.tr.insert(coordinates.pos, node);
      view.dispatch(transaction);
    });

    return true;
  };
}
