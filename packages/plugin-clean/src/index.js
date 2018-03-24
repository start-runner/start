// @flow
import type { StartPlugin } from '@start/sequence/src/'

const clean: StartPlugin = ({ input, logPath }) => {
  const makethen = require('makethen')
  const rimraf = require('rimraf')

  const rimrafP = makethen(rimraf)

  const options = {
    glob: false,
  }

  return Promise.all(
    input.map((file) => {
      return rimrafP(file.path, options).then(() => {
        if (typeof logPath === 'function') {
          logPath(file.path)
        }

        return file
      })
    })
  )
}

export default clean
