<script lang="ts">
  //App.svelte
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import Board from "./components/Board.svelte";

  // Create a client
  const queryClient = new QueryClient();
</script>

<main>
  <Board />
</main>

<style>
</style>
