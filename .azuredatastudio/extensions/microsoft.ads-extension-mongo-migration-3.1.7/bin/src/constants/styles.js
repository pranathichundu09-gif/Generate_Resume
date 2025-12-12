"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerRight = exports.headerLeft = exports.styleRight = exports.styleLeft = exports.BOLD_NOTE_CSS = exports.NOTE_CSS = exports.LIGHT_LABEL_CSS = exports.LABEL_CSS = exports.SMALL_BODY_CSS = exports.BODY_CSS = exports.SECTION_HEADER_CSS = exports.PAGE_SUBTITLE_CSS = exports.PAGE_TITLE_CSS = exports.DASHBOARD_TITLE_CSS = void 0;
exports.DASHBOARD_TITLE_CSS = {
    'font-size': '32px',
    'line-height': '48px',
    'margin': '16px 0 8px 0',
};
exports.PAGE_TITLE_CSS = {
    'font-size': '18px',
    'line-height': '24px',
    'font-weight': '600',
    'margin': '0 0 4px 0',
};
exports.PAGE_SUBTITLE_CSS = {
    'font-size': '15px',
    'line-height': '19px',
    'margin': '0 0 12px 0',
};
exports.SECTION_HEADER_CSS = {
    'font-size': '14px',
    'line-height': '20px',
    'font-weight': '600',
    'margin': '4px 0',
};
exports.BODY_CSS = {
    'font-size': '13px',
    'line-height': '18px',
    'margin': '4px 0',
};
exports.SMALL_BODY_CSS = {
    'font-size': '10px',
    'line-height': '18px',
    'margin': '4px 0',
    'font-weight': '600',
};
exports.LABEL_CSS = {
    ...exports.BODY_CSS,
    'margin': '0 0 4px 0',
    'font-weight': '600',
};
exports.LIGHT_LABEL_CSS = {
    ...exports.BODY_CSS,
    'font-weight': '350',
};
exports.NOTE_CSS = {
    'font-size': '12px',
    'line-height': '16px',
    'margin': '0',
    'font-weight': '350',
};
exports.BOLD_NOTE_CSS = {
    ...exports.NOTE_CSS,
    'font-weight': '600',
};
exports.styleLeft = {
    border: "none",
    "text-align": "left",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
};
exports.styleRight = {
    border: "none",
    "text-align": "right",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
};
exports.headerLeft = {
    border: "none",
    "text-align": "left",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
    "border-bottom": "1px solid #C4C4C4",
};
exports.headerRight = {
    border: "none",
    "text-align": "right",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
    "border-bottom": "1px solid #C4C4C4",
};
//# sourceMappingURL=styles.js.map