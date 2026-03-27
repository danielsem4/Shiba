import * as XLSX from 'xlsx'

interface ExportOptions {
  data: object[]
  filename: string
  sheetName?: string
}

export function exportToExcel({ data, filename, sheetName = 'Sheet1' }: ExportOptions): void {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
