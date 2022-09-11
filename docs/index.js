/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageLoad = performance.now();

console.log("loading");

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const installServiceWorker = Promise.resolve().then(function () {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker.register("sw.js");
  } else {
    throw new Error("serviceWorker not in navigator");
  }
});

Promise.all( [ loadWindow, installServiceWorker ] ).then(start, fail);

function fail(e) {
  console.error("loadFail");
  console.error(e);
}

function start( [ evtWindow, serviceWorkerRegistration ] ) {
  const loadTime = performance.now() - initPageLoad;
  console.log("Load Time:", loadTime);
  if (self.crossOriginIsolated) {
    console.log("Cross Origin Isolated");
  } else {
    console.log("Not Cross Origin Isolated");
  }
  try {
    const a = new SharedArrayBuffer();
    console.log("Success!");
  } catch (e) {
    console.error(e);
  }
}
