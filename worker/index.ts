export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // статика из сборки
    let res = await env.ASSETS.fetch(request);

    // SPA fallback
    if (res.status === 404 && (request.method === "GET" || request.method === "") && 
        (!request.headers.get("accept") || request.headers.get("accept")!.includes("text/html"))) {
      const u = new URL(request.url);
      u.pathname = "/index.html";
      res = await env.ASSETS.fetch(new Request(u.toString(), request));
    }
    return res;
  }
} satisfies ExportedHandler<Env>;

export interface Env {
  ASSETS: Fetcher;
}
