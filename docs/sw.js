/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function self_install(e) {
  console.log("sw.js: Start Installing");
  function addCaches(cache) {
    console.log("sw.js: Start Adding Caches");
    console.log("sw.js: End Adding Caches");
  }
  e.waitUntil(caches.open("store").then(addCaches));
  console.log("sw.js: End Installing");
}

function self_fetch(e) {
  console.log("sw.js: Start Handling Fetch");
  console.log(e.request);
  async function getResponse() {
    try {
      const receivedResponse = await fetch(e.request);
      /*
      console.log("Received Headers");
      for (const [key, value] of receivedResponse.headers) {
        console.log(key, ":", value);
      }
      */
      const sentHeaders = new Headers();
      for (const [key, value] of receivedResponse.headers) {
        sentHeaders.append(key, value);
      }
      sentHeaders.append("Cross-Origin-Opener-Policy", "same-origin");
      sentHeaders.append("Cross-Origin-Embedder-Policy", "require-corp");
      /*
      console.log("Sent Headers");
      for (const [key, value] of sentHeaders) {
        console.log(key, ":", value);
      }
      */
      let sentBody;
      // Per RFC4329, force all ".js" and ".mjs" files to have MIME type "application/javascript"
      if (e.request.url.endsWith(".js") || e.request.url.endsWith(".mjs")) {
        const bodyContents = await receivedResponse.arrayBuffer();
        sentBody = new Blob( [ bodyContents ], {
          type: "application/javascript",
        });
      } else {
        sentBody = await receivedResponse.blob();
      }
      const sentResponse = new Response(sentBody, {
        status: 200,
        statusText: "OK",
        headers: sentHeaders,
      });
      return sentResponse;
    } catch (e) {
      console.error(e);
      const sentResponse = new Response("", {
        status: 404,
        statusText: "Not Found",
      });
      return sentResponse;
    }
  }
  e.respondWith(getResponse());
  console.log("sw.js: End Handling Fetch");
}

self.addEventListener("install", self_install);
self.addEventListener("fetch", self_fetch);
