export const componentDemoEntries = [
  ["alert", { id: "alert-basic", title: "Alert: tone and dismiss patterns" }],
  ["actionsheet", { id: "action-sheet-basic", title: "ActionSheet: bottom action list" }],
  ["anchor", { id: "anchor-basic", title: "Anchor: in-page section navigation" }],
  ["appheader", { id: "app-header-basic", title: "AppHeader: brand, nav, and actions" }],
  [
    "appprovider",
    {
      id: "app-provider-basic",
      title: "AppProvider: locale, direction, and navigation",
    },
  ],
  [
    "appshell",
    {
      id: "app-shell-basic",
      title: "AppShell: header, sidebar, and content regions",
    },
  ],
  ["avatar", { id: "avatar-basic", title: "Avatar: initials, size, shape, and status" }],
  [
    "autocomplete",
    {
      id: "autocomplete-basic",
      title: "Autocomplete: free text with suggestion commit",
    },
  ],
  ["badge", { id: "badge-basic", title: "Badge: compact status labels" }],
  [
    "breadcrumboverflow",
    {
      id: "breadcrumbs-overflow-basic",
      title: "BreadcrumbOverflow: collapsed long paths",
    },
  ],
  [
    "breadcrumbs",
    {
      id: "breadcrumbs-basic",
      title: "Breadcrumbs: hierarchical location path",
    },
  ],
  ["button", { id: "button-basic", title: "Button: interactive counter" }],
  ["calendar", { id: "calendar-basic", title: "Calendar: native date/month selection" }],
  ["card", { id: "card-basic", title: "Card: header, body, footer composition" }],
  ["cascader", { id: "cascader-basic", title: "Cascader: multi-level option selection" }],
  ["chip", { id: "chip-basic", title: "Chip: compact metadata token" }],
  ["combobox", { id: "combobox-basic", title: "Combobox: search and select options" }],
  [
    "confirmdialog",
    {
      id: "confirm-dialog-basic",
      title: "ConfirmDialog: destructive action confirmation",
    },
  ],
  [
    "commandpalette",
    {
      id: "command-palette-basic",
      title: "CommandPalette: quick action launcher",
    },
  ],
  ["collapse", { id: "collapse-basic", title: "Collapse: details and summary disclosure" }],
  [
    "configprovider",
    {
      id: "config-provider-basic",
      title: "ConfigProvider: app-level locale and navigation context",
    },
  ],
  [
    "datagridlite",
    {
      id: "data-grid-lite-basic",
      title: "DataGridLite: sorting and selection",
    },
  ],
  ["datalist", { id: "data-list-basic", title: "DataList: item metadata and actions" }],
  ["descriptions", { id: "descriptions-basic", title: "Descriptions: record detail fields" }],
  [
    "divider",
    {
      id: "divider-basic",
      title: "Divider: horizontal and vertical separators",
    },
  ],
  [
    "datatable",
    {
      id: "data-table-basic",
      title: "DataTable: sorting, selection, and pagination",
    },
  ],
  ["datepicker", { id: "date-picker-basic", title: "DatePicker: calendar date selection" }],
  [
    "datetimepicker",
    {
      id: "date-time-picker-basic",
      title: "DateTimePicker: combined date and time",
    },
  ],
  [
    "daterangepicker",
    {
      id: "date-range-picker-basic",
      title: "DateRangePicker: start and end selection",
    },
  ],
  ["dropdown", { id: "dropdown-basic", title: "Dropdown: menu wrapper for actions" }],
  ["empty", { id: "empty-basic", title: "Empty: generic no-data messaging" }],
  ["drawer", { id: "drawer-basic", title: "Drawer: side panel workflow" }],
  [
    "emptystate",
    {
      id: "empty-state-basic",
      title: "EmptyState: recovery-focused messaging",
    },
  ],
  [
    "emptyresults",
    {
      id: "empty-results-basic",
      title: "EmptyResults: no-match recovery state",
    },
  ],
  [
    "fileupload",
    {
      id: "file-upload-basic",
      title: "FileUpload: native file picker and constraints",
    },
  ],
  ["field", { id: "field-basic", title: "Field: label, description, error wiring" }],
  [
    "flex",
    {
      id: "flex-basic",
      title: "Flex: one-dimensional alignment and distribution",
    },
  ],
  ["form", { id: "form-basic", title: "Form: submit and reset orchestration" }],
  [
    "formfieldset",
    {
      id: "form-fieldset-basic",
      title: "FormFieldset: grouped controls with legend",
    },
  ],
  ["formlayout", { id: "form-layout-basic", title: "FormLayout: structured form sections" }],
  [
    "formmessage",
    {
      id: "form-message-basic",
      title: "FormMessage: helper and validation feedback",
    },
  ],
  [
    "grid",
    {
      id: "grid-basic",
      title: "Grid: span-based tile layout",
      parity: {
        codeIncludes: ["GridItem", "columns={4}", "span={4}"],
        previewIncludes: ['data-columns="4"', 'data-span="4"'],
      },
    },
  ],
  [
    "filterbar",
    {
      id: "filter-bar-basic",
      title: "FilterBar: grouped controls and actions",
    },
  ],
  ["filterpanel", { id: "filter-panel-basic", title: "FilterPanel: drawer-based filters" }],
  ["floatingpanel", { id: "floating-panel-basic", title: "FloatingPanel: draggable snap heights" }],
  ["input", { id: "field-input", title: "Field + Input: validation wiring" }],
  ["inlinealert", { id: "inline-alert-basic", title: "InlineAlert: compact in-flow status" }],
  ["infinitescroll", { id: "infinite-scroll-basic", title: "InfiniteScroll: progressive feed loading" }],
  ["image", { id: "image-basic", title: "Image: media with fit strategies" }],
  ["imageuploader", { id: "image-uploader-basic", title: "ImageUploader: preview and upload queue" }],
  ["imageviewer", { id: "image-viewer-basic", title: "ImageViewer: fullscreen gallery overlay" }],
  [
    "layout",
    {
      id: "layout-basic",
      title: "Layout: header, sider, content, footer shell",
      parity: {
        sharedIncludes: ["Toggle sidebar"],
      },
    },
  ],
  [
    "link",
    {
      id: "link-basic",
      title: "Link: internal routing and external navigation",
    },
  ],
  ["checkbox", { id: "checkbox-basic", title: "Checkbox: native checked semantics" }],
  [
    "radio",
    {
      id: "radio-group",
      title: "RadioGroup: single selection",
      parity: {
        codeIncludes: ["RadioGroup"],
      },
    },
  ],
  [
    "rangeslider",
    {
      id: "range-slider-basic",
      title: "RangeSlider: two-thumb range selection",
    },
  ],
  ["result", { id: "result-basic", title: "Result: outcome and recovery actions" }],
  ["segmented", { id: "segmented-basic", title: "Segmented: mode and view switching" }],
  ["pageheader", { id: "page-header-basic", title: "PageHeader: title, subtitle, actions" }],
  ["popover", { id: "popover-basic", title: "Popover: anchored disclosure panel" }],
  ["progress", { id: "progress-basic", title: "Progress: completion and status tracking" }],
  ["pulltorefresh", { id: "pull-to-refresh-basic", title: "PullToRefresh: top-edge feed refresh" }],
  ["select", { id: "select-basic", title: "Select: native option selection" }],
  ["sidenav", { id: "side-nav-basic", title: "SideNav: sectioned app navigation" }],
  ["topnav", { id: "top-nav-basic", title: "TopNav: horizontal route navigation" }],
  ["splitter", { id: "splitter-basic", title: "Splitter: resizable two-pane layout" }],
  ["skeleton", { id: "skeleton-basic", title: "Skeleton: loading placeholders" }],
  ["slider", { id: "slider-basic", title: "Slider: range selection with live value" }],
  ["spinner", { id: "spinner-basic", title: "Spinner: inline loading indicator" }],
  [
    "space",
    {
      id: "space-basic",
      title: "Space: consistent inline and wrapped spacing",
    },
  ],
  ["statistic", { id: "statistic-basic", title: "Statistic: labeled value metrics" }],
  ["steps", { id: "steps-basic", title: "Steps: multi-step progress indicator" }],
  ["switch", { id: "switch-basic", title: "Switch: boolean setting toggle" }],
  ["tabbar", { id: "tab-bar-basic", title: "TabBar: bottom destination navigation" }],
  ["swipeaction", { id: "swipe-action-basic", title: "SwipeAction: reveal row controls" }],
  ["table", { id: "table-basic", title: "Table: semantic columns and rows" }],
  ["tag", { id: "tag-basic", title: "Tag: categorization labels" }],
  ["tabs", { id: "tabs-basic", title: "Tabs: manual activation" }],
  ["textarea", { id: "textarea-basic", title: "Textarea: multiline field input" }],
  ["transfer", { id: "transfer-basic", title: "Transfer: move items between lists" }],
  ["timepicker", { id: "time-picker-basic", title: "TimePicker: time-of-day selection" }],
  ["timeline", { id: "timeline-basic", title: "Timeline: ordered event history" }],
  ["dialog", { id: "dialog-controlled", title: "Dialog: controlled open/close" }],
  ["menu", { id: "menu-actions", title: "Menu: keyboard navigation" }],
  [
    "numberinput",
    {
      id: "number-input-basic",
      title: "NumberInput: constrained numeric value",
    },
  ],
  [
    "pagination",
    {
      id: "pagination-basic",
      title: "Pagination: previous, next, and current page",
    },
  ],
  [
    "toast",
    {
      id: "toast-queue",
      title: "Toast: queue and auto-dismiss",
      parity: {
        codeIncludes: ["ToastViewport", "createToastStore"],
        codeExcludes: ["Toast"],
      },
    },
  ],
  ["tooltip", { id: "tooltip-basic", title: "Tooltip: hover and focus context" }],
  ["typography", { id: "typography-basic", title: "Typography: semantic text primitives" }],
  ["tree", { id: "tree-basic", title: "Tree: hierarchical navigation and selection" }],
  [
    "treeselect",
    {
      id: "tree-select-basic",
      title: "TreeSelect: hierarchical option picker",
    },
  ],
]

export const demoByComponent = new Map(componentDemoEntries)
export const demoIds = new Set(componentDemoEntries.map(([, entry]) => entry.id))
