<script lang="ts">
  import { onMount } from 'svelte'
  import '../app.css'
  import Terminal from '../components/Terminal.svelte'
  import { startWatching } from '../web3/watch'

  // Start watching for changes in network and account
  onMount(startWatching)
</script>

<Terminal />
