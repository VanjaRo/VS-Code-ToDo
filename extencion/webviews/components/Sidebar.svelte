<script lang="ts">
  import { bind, onMount } from "svelte/internal";

  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      console.log({ message });
      switch (message.type) {
        case "new-todo":
          todos = [{ text: message.value, completed: false }, ...todos];
          break;
      }
    });
  });

</script>

<form
  on:submit|preventDefault={() => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo}
    <li
      class:complete={todo.completed}
      on:click={() => {
        todo.completed = !todo.completed;
      }}
    >
      {todo["text"]}
    </li>
  {/each}
</ul>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "Info message",
    });
  }}>click me for info</button
>
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "Error message",
    });
  }}>click me for error</button
>

<style>
  .complete {
    text-decoration: line-through;
  }

</style>
