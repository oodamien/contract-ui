import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export function exportContract(filename, extention, contract) {
  const blob = new Blob([contract], {
    type: 'application/x-yaml;charset=utf-8',
  })
  saveAs(blob, `${filename}${extention}`)
}

export function exportContracts(filename, contracts) {
  const zip = new JSZip()
  contracts.forEach(contract => {
    zip.file(`${contract.filename}${contract.extention}`, contract.contract)
  })
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, filename)
  })
}
