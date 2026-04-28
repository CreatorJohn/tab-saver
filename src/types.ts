type TabData = {
  id: number;
  title: string;
  url: string;
}

type SuccessSaveResponse = {
  success: true
}

type FailedSaveResponse = {
  success: false
  message: string
}

type SaveResponse = SuccessSaveResponse | FailedSaveResponse

type SuccessOpenResponse = {
  success: true
}

type FailedOpenResponse = {
  success: false
  message: string
}

type OpenResponse = SuccessOpenResponse | FailedOpenResponse

type SuccessLoadResponse = {
  success: true
  tabs: TabData[]
}

type FailedLoadResponse = {
  success: false
  message: string
}

type LoadResponse = SuccessLoadResponse | FailedLoadResponse

type SuccessExportResponse = {
  success: true
}

type FailedExportResponse = {
  success: false
}

type ExportResponse = SuccessExportResponse | FailedExportResponse

type MessageResponse = SaveResponse | OpenResponse | LoadResponse | ExportResponse

type LoadTabsMessage = {
  action: "loadTabs"
}

type SaveTabsMessage = {
  action: "saveTabs"
  tabs: TabData[]
}

type OpenTabsMessage = {
  action: "openTabs",
  tabs: TabData[]
}

type ExportTabsMessage = {
  action: "exportTabs"
}

type Message = LoadTabsMessage | SaveTabsMessage | OpenTabsMessage | ExportTabsMessage