<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";

  export let user: User;
  let text = "";
  let todos: Array<{ text: string; completed: boolean }> = [];
  onMount(async () => {
    window.addEventListener("message", async (event) => {
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

<div>Hellow: {user.name}</div>

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

<style>
  .complete {
    text-decoration: line-through;
  }

</style>
