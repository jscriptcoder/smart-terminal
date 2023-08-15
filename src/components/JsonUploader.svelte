<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import cmdFuncMap from '../commands/cmdFuncMap'
  import Deferred from '../utils/Deferred'
  import type { Chain } from '@wagmi/core'
  import { CHAIN_STORAGE_KEY, chainSchema } from '../utils/chain'
  import type { ValidationError } from 'validate'

  export let variables: Record<string, unknown> = {}

  let inputFile: HTMLInputElement
  let deferredJson: Deferred<unknown>

  function onJsonLoaderChange(jsonLoaderEvent: Event) {
    const target = jsonLoaderEvent?.target as HTMLInputElement
    const file = target?.files?.[0]

    console.log('File loaded: ', file)

    if (!file) {
      deferredJson.reject(new Error('No file selected.'))
      return
    }

    const reader = new FileReader()

    reader.onload = ({ target }) => {
      if (!target) {
        deferredJson.reject(new Error('No file loaded.'))
        return
      }

      console.log('Target loaded: ', target)

      const json = JSON.parse(target.result as string)
      console.log('JSON loaded: ', json)

      deferredJson.resolve(json)
    }

    reader.readAsText(file, 'utf-8')
  }

  function onWindowFocus() {
    // This is hacky, but I'm not sure a better way to find out
    // whether the user has canceled the file selection or not.
    // This event is triggered before the onJsonLoaderChange event,
    // and even needs some time before running the check
    // TODO: do we have a better way to check this?
    setTimeout(() => {
      if (inputFile.value === '') {
        deferredJson.reject(new Error('File selection canceled.'))
      } else {
        inputFile.value = ''
      }
    }, 500)

    window.removeEventListener('focus', onWindowFocus)
  }

  onMount(() => {
    cmdFuncMap['loadJson'] = {
      exec: () => {
        inputFile.click()

        // We need to know when the focus is back to the window
        // so we can check if the user has canceled the file selection
        window.addEventListener('focus', onWindowFocus)

        deferredJson = new Deferred()

        return deferredJson.promise
      },
      help: [
        'Loads a JSON file.',
        'Usage:',
        'loadJson > parsedJson => Sends the parsed json into a variable'
      ].join('<br>')
    }

    cmdFuncMap['loadVars'] = {
      exec: async () => {
        const objVariables = await cmdFuncMap['loadJson'].exec()

        if (Array.isArray(objVariables) || typeof objVariables !== 'object') {
          throw new Error('The loaded file is not a valid JSON object.')
        }

        variables = { ...variables, ...objVariables }

        return objVariables
      },
      help: [
        'Loads a JSON file with variables.',
        'Usage: loadVars => Sends the parsed json into variables defined in the file'
      ].join('<br>')
    }

    cmdFuncMap['loadChains'] = {
      exec: async () => {
        let objChains = (await cmdFuncMap['loadJson'].exec()) as Chain | Chain[]
        objChains = Array.isArray(objChains) ? objChains : [objChains]

        // Throws validation errors if any of the chains is invalid
        let schemaValidationErrors: ValidationError[] = []

        if (
          objChains.some((chain) => {
            schemaValidationErrors = chainSchema.validate(chain)
            return schemaValidationErrors.length > 0
          })
        ) {
          throw schemaValidationErrors
        }

        const serializedChains = JSON.stringify(objChains)
        localStorage.setItem(CHAIN_STORAGE_KEY, serializedChains)

        location.reload()
        return 'Reloading app...'
      },
      help: [
        'Loads custom chains from a JSON file.',
        'Usage: loadChains => Sends the parsed json into localStorage and refresh the app loading the new chains'
      ].join('<br>')
    }

    inputFile.addEventListener('change', onJsonLoaderChange)
  })

  onDestroy(() => {
    inputFile.removeEventListener('change', onJsonLoaderChange)
    window.removeEventListener('focus', onWindowFocus)
  })
</script>

<input type="file" accept="application/json" bind:this={inputFile} />
