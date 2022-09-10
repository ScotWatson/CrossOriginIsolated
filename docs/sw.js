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
  async function getResponse() {
    try {
      const received = await fetch(e.request);
      console.log("Received Headers");
      for (const [key, value] of received.headers) {
        console.log(key, ":", value);
      }
      const responseHeaders = new Headers();
      responseHeaders.append("Cross-Origin-Opener-Policy", "same-origin");
      responseHeaders.append("Cross-Origin-Embedder-Policy", "require-corp");
      console.log("Response Headers");
      for (const [key, value] of responseHeaders) {
        console.log(key, ":", value);
      }
      const response = new Response(received.body, {
        status: 200,
        statusText: "OK",
        headers: responseHeaders,
      });
      return response;
    } catch (e) {
      const response = new Response(e.message, {
        status: 200,
        statusText: "OK",
      });
      return response;
    }
  }
  e.respondWith(getResponse());
  console.log("sw.js: End Handling Fetch");
}

self.addEventListener("install", self_install);
self.addEventListener("fetch", self_fetch);
