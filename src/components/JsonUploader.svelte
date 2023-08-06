<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import cmdFuncMap from '../commands/cmdFuncMap'
  import Deferred from '../utils/Deferred'

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
        'Load a JSON file.',
        'Usage: loadjson > objVar - sending the parsed json into a variable'
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
