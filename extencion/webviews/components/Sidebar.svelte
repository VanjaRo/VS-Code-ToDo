<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import Todos from "./Todos.svelte";

  let accessToken = "";
  let loading = true;
  let user: User | null = null;

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      console.log({ message });
      switch (message.type) {
        case "token":
          accessToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: { authorization: `Bearer ${accessToken}` },
          });
          const data = await response.json();
          user = data.user;
          loading = false;
      }
    });
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });

</script>

{#if loading}
  <div>Loading ...</div>
{:else if user}
  <Todos {user} />
  <button
    on:click={() => {
      accessToken = "";
      user = null;
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}>Logout</button
  >
{:else}
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Login with GitHub.</button
  >
{/if}
