// @flow
import type { StartPlugin } from '@start/sequence/src/'

export default (callback: (file: string) => string) => {
  const rename: StartPlugin = ({ input, logPath }) => {
    const path = require('path')

    return input.map((file) => {
      const newPath = callback(file.path)

      if (file.path === newPath) {
        return file
      }

      if (typeof logPath === 'function') {
        logPath(newPath)
      }

      if (file.map) {
        // TODO: why not?
        // file.map.file = path.basename(newPath)
        file.map = {
          ...file.map,
          file: path.basename(newPath),
        }
      }

      return {
        path: newPath,
        data: file.data,
        map: file.map,
      }
    })
  }

  return rename
}
