import {
  ScriptTarget,
  ModuleResolutionKind,
  getPreEmitDiagnostics,
  flattenDiagnosticMessageText,
  CompilerOptions,
  ModuleKind
} from 'typescript'
import plugin from '@start/plugin/src/'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default (outDirRelative: string, userOptions?: CompilerOptions) =>
  plugin('typescriptGenerate', async ({ files, logFile }) => {
    const { createProgram } = await import('typescript')
    const path = await import('path')
    const options = {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      moduleResolution: ModuleResolutionKind.NodeJs,
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      ...userOptions,
      declarationDir: path.resolve(outDirRelative),
      declaration: true,
      emitDeclarationOnly: true
    }
    const filePaths = files.map((file) => file.path)

    filePaths.forEach(logFile)

    const program = createProgram(filePaths, options)
    const emitResult = program.emit()
    const allDiagnostics = getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n')

        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
      } else {
        console.log(`${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
      }
    })

    return { files }
  })
