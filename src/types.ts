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

type SuccessImportResponse = {
  success: true
  count: number
}

type FailedImportResponse = {
  success: false
  message: string
}

type ImportResponse = SuccessImportResponse | FailedImportResponse

type MessageResponse = SaveResponse | OpenResponse | LoadResponse | ExportResponse | ImportResponse

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

type ImportTabsMessage = {
  action: "importTabs"
  tabs: TabData[]
  mode: "merge" | "overwrite"
}

type Message = LoadTabsMessage | SaveTabsMessage | OpenTabsMessage | ExportTabsMessage | ImportTabsMessage
