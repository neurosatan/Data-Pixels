//Imports
import { SharedStates as S } from "../support/sharedStates.js";
import * as C from "../support/constants.js";

/**
 * @description The <strong>layout.js</strong> module contains properties and functions pertaining to orientation and resizing of the the Code Editor, iFrame and Drag Bar.
 * @requires constants
 * @requires sharedStates
 * @module
 * 
 */
export {
    
    toggleLayout,
    setContentDisplayType,
    updateContentFlexSizes
};

/**
 * @description An object containing the following members with module scope:
 * <ul>
 *     <li> DragBarSize </li>
 * </ul>
 * 
 * @private
 * @constant
 * 
 */
const M = {

    DragBarSize: undefined
};

/**
 * @description Toggles the horizontal/vertical orientation of the Code Editor, iFrame and Drag Bar. 
 * @public
 * @function
 * 
 */
function toggleLayout() {

    const dragBar = C.HTMLElement.DRAG_BAR;
    const content = C.HTMLElement.CONTENT;
    const dragBarHorizontal = C.CSSClass.DRAG_BAR_HORIZONTAL;
    const dragBarVertical = C.CSSClass.DRAG_BAR_VERTICAL;

    dragBar.classList.remove(dragBarHorizontal, dragBarVertical);
    content.style.flexDirection = (S.Orientation === C.Orientation.HORIZONTAL) ? C.CSS.COLUMN : C.CSS.ROW;
    dragBar.classList.add((S.Orientation === C.Orientation.HORIZONTAL) ? dragBarHorizontal : dragBarVertical);

    validateLayout();
}

/**
 * @description Determines if the Code Editor or iFrame size is less than the defined minimum size and, if so, adjusts accordingly.
 * @private
 * @function
 * 
 */
function validateLayout() {

    const codeEditor = C.HTMLElement.CODE_EDITOR;
    const frameView = C.HTMLElement.FRAME_VIEW;
    const minSize = C.Measurement.CONTENT_MIN_SIZE;

    updateContentSizes();
    
    if (S.Orientation === C.Orientation.HORIZONTAL) {

        if (S.CodeEditorSize.height < minSize || S.FrameViewSize.height < minSize) {

            const adjustmentTarget = (S.CodeEditorSize.height < minSize) ? codeEditor : frameView;
            const adjustmentSize = minSize - adjustmentTarget.offsetHeight;

            adjustLayout(adjustmentTarget, adjustmentSize);
        }

        return;
    }

    if (S.Orientation === C.Orientation.VERTICAL) {

        if (S.CodeEditorSize.width < minSize || S.FrameViewSize.width < minSize) {

            const adjustmentTarget = (S.CodeEditorSize.width < minSize) ? codeEditor : frameView;
            const adjustmentSize = minSize - adjustmentTarget.offsetWidth;

            adjustLayout(adjustmentTarget, adjustmentSize);
        }
    }
}

/**
 * @description Updates the width and height properties of the objects that are used to reference the size of the Code Editor, iFrame and Drag Bar. 
 * @private
 * @function
 * 
 */
function updateContentSizes() {

    const codeEditor = C.HTMLElement.CODE_EDITOR;
    const dragBar = C.HTMLElement.DRAG_BAR;
    const frameView = C.HTMLElement.FRAME_VIEW;

    S.CodeEditorSize = {
        
        width: codeEditor.offsetWidth,
        height: codeEditor.offsetHeight
    };

    M.DragBarSize = {

        width: dragBar.offsetWidth,
        height: dragBar.offsetHeight
    };

    S.FrameViewSize = {
        
        width: frameView.offsetWidth,
        height: frameView.offsetHeight
    };
}

/**
 * @description Adjusts the widths or heights, depending on orientation, of the Code Editor and iFrame to comply with the defined minimum size.
 * @peram {object} adjustmentTarget - The Code Editor or iFrame that does not comply with the defined minimum size.
 * @peram {number} adjustmentSize - The amount, in pixels, to add to the adjustmentTarget's size so that it is equal to the defined minimum size.
 * @private
 * @function
 * 
 */
function adjustLayout(adjustmentTarget, adjustmentSize) {

    const codeEditor = C.HTMLElement.CODE_EDITOR;
    const frameView = C.HTMLElement.FRAME_VIEW;

    if (S.Orientation === C.Orientation.HORIZONTAL) {

        S.CodeEditorSize.height = (adjustmentTarget === codeEditor) ? S.CodeEditorSize.height + adjustmentSize : S.CodeEditorSize.height - adjustmentSize;
        S.FrameViewSize.height = (adjustmentTarget === frameView) ? S.FrameViewSize.height + adjustmentSize : S.FrameViewSize.height - adjustmentSize;
    }

    if (S.Orientation === C.Orientation.VERTICAL) {

        S.CodeEditorSize.width = (adjustmentTarget === codeEditor) ? S.CodeEditorSize.width + adjustmentSize : S.CodeEditorSize.width - adjustmentSize;
        S.FrameViewSize.width = (adjustmentTarget === frameView) ? S.FrameViewSize.width + adjustmentSize : S.FrameViewSize.width - adjustmentSize;
    }

    updateContentDisplayType(C.CSS.BLOCK);
    updateContentDisplayType(C.CSS.FLEX);
}

/**
 * @description Changes the CSS display type to facilitate both automatic (CSS Flexbox) and manual (Drag Bar) resizing of the Code Editor, iFrame and Drag Bar.
 * @param {string} CSSDisplayType - The CSS display type, either "block" or "flex", to assign the content container of the Code Editor, iFrame and Drag Bar.
 * @private
 * @function
 * 
 */
function updateContentDisplayType(CSSDisplayType) {

    const content = C.HTMLElement.CONTENT;
    const codeEditor = C.HTMLElement.CODE_EDITOR;
    const dragBar = C.HTMLElement.DRAG_BAR;
    const frameView = C.HTMLElement.FRAME_VIEW;

    if (CSSDisplayType === C.CSS.BLOCK) {

        content.style.display = C.CSS.BLOCK;
        codeEditor.style.flex = C.CSS.NONE;
        frameView.style.flex = C.CSS.NONE;

        codeEditor.style.width = `${S.CodeEditorSize.width}${C.CSS.PX}`;
        codeEditor.style.height = `${S.CodeEditorSize.height}${C.CSS.PX}`;

        frameView.style.width = `${S.FrameViewSize.width}${C.CSS.PX}`;
        frameView.style.height = `${S.FrameViewSize.height}${C.CSS.PX}`;

        if (S.Orientation === C.Orientation.VERTICAL) {

            dragBar.style.width = `${M.DragBarSize.width}${C.CSS.PX}`;
            dragBar.style.height = `${M.DragBarSize.height}${C.CSS.PX}`;

            codeEditor.style.float = C.CSS.LEFT;
            dragBar.style.float = C.CSS.LEFT;
            frameView.style.float = C.CSS.LEFT;
        }

        return;
    }

    if (CSSDisplayType === C.CSS.FLEX) {

        let codeEditorRatio;
        let frameViewRatio;

        content.style.display = C.CSS.FLEX;
        codeEditor.style.width = C.CSS.AUTO;
        codeEditor.style.height = C.CSS.AUTO;
        frameView.style.width = C.CSS.AUTO;
        frameView.style.height = C.CSS.AUTO;

        if (S.Orientation === C.Orientation.HORIZONTAL) {

            const totalHeight = S.CodeEditorSize.height + S.FrameViewSize.height;
            
            codeEditorRatio = S.CodeEditorSize.height / totalHeight;
            frameViewRatio = S.FrameViewSize.height / totalHeight;
        }
        else if (S.Orientation === C.Orientation.VERTICAL) {

            codeEditor.style.float = C.CSS.NONE;
            frameView.style.float = C.CSS.NONE;
            dragBar.style.float = C.CSS.NONE;
            dragBar.style.width = C.CSS.AUTO;
            dragBar.style.height = C.CSS.AUTO;

            const totalWidth = S.CodeEditorSize.width + S.FrameViewSize.width;
            
            codeEditorRatio = S.CodeEditorSize.width / totalWidth;
            frameViewRatio = S.FrameViewSize.width / totalWidth;
        }

        updateContentFlexSizes(codeEditorRatio, frameViewRatio);
    }
}

/**
 * @description Updates the CSS flex-grow properties of the Code Editor and the iFrame. 
 * @param {number} codeEditorFlexGrow - The CSS flex-grow value for the Code Editor.
 * @param {number} frameViewFlexGrow - The CSS flex-grow value for the iFrame.
 * @public
 * @function
 * 
 */
function updateContentFlexSizes(codeEditorFlexGrow, frameViewFlexGrow) {

    const codeEditor = C.HTMLElement.CODE_EDITOR;
    codeEditor.style.flex = codeEditorFlexGrow;
    S.CodeEditorFlexGrow = codeEditorFlexGrow;

    const frameView = C.HTMLElement.FRAME_VIEW;
    frameView.style.flex = frameViewFlexGrow;
    S.FrameViewFlexGrow = frameViewFlexGrow;
}

/**
 * @description Sets the CSS display type in preparation for either automatic (CSS Flexbox) or manual (Drag Bar) resizing of the Code Editor, iFrame and Drag Bar.
 * @param {string} CSSDisplayType - The CSS display type, either "block" or "flex", to assign the content container of the Code Editor, iFrame and Drag Bar. 
 * @public
 * @function
 * 
 */
function setContentDisplayType(CSSDisplayType) {

    updateContentSizes();
    updateContentDisplayType(CSSDisplayType);
}