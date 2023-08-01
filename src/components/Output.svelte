<script lang="ts" context="module">
  export enum TypePrint {
    PROMPT,
    INFO,
    WAIT,
    ERROR
  }
</script>

<script lang="ts">
  let outputElem: HTMLDivElement

  export function print(
    text: string,
    type: TypePrint,
    wrapperElem: HTMLDivElement = document.createElement('div')
  ) {
    wrapperElem.className = ''

    switch (type) {
      case TypePrint.PROMPT:
        wrapperElem.classList.add('output__prompt')
        wrapperElem.innerHTML = ['<span>$&gt;</span>', `<div>${text}</div>`].join('')

        break
      case TypePrint.INFO:
        wrapperElem.classList.add('output__info')
        wrapperElem.textContent = text

        break
      case TypePrint.WAIT:
        wrapperElem.classList.add('output__wait')
        wrapperElem.textContent = text

        break
      case TypePrint.ERROR:
        wrapperElem.classList.add('output__error')
        wrapperElem.innerHTML = text

        break
    }

    outputElem.appendChild(wrapperElem)

    return wrapperElem
  }
</script>

<div class="Output" bind:this={outputElem} />

<style>
  @keyframes ellipsis {
    to {
      width: 3rem;
    }
  }

  :global(.output__prompt) {
    display: flex;
    align-items: baseline;
    margin-top: 0.5rem;
  }

  :global(.output__prompt > div) {
    margin-left: 0.5rem;
  }

  :global(.output__wait:after) {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis steps(4, end) 1000ms infinite;
    content: '...';
    width: 0px;
  }

  :global(.output__error) {
    color: rgb(255, 150, 150);
    text-shadow: none;
  }
</style>
