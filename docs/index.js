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

const importQueue = import("https://scotwatson.github.io/Queue/Queue.mjs");

Promise.all( [ loadWindow, installServiceWorker, importQueue ] ).then(start, fail);

function fail(e) {
  console.error("loadFail");
  console.error(e);
}

function start( [ evtWindow, serviceWorkerRegistration, Queue ] ) {
  const loadTime = performance.now() - initPageLoad;
  let receivedQueue;
  const worker = new Worker("worker.js");
  worker.addEventListener("message", function (evt) {
    console.log("index.js mesage event triggered.");
    receivedQueue = new Queue.DataQueue({
      buffer: evt.data,
      shared: true,
    });
  });
  console.log("Load Time:", loadTime);
  if (self.crossOriginIsolated) {
    console.log("Cross Origin Isolated");
  } else {
    console.log("Not Cross Origin Isolated");
  }
  try {
    const a = new SharedArrayBuffer();
    console.log("Success!");
    let sentQueue = new Queue.DataQueue({
      viewCtor: self.Uint8Array,
      length: 20,
      shared: true,
    });
    setTimeout(function () {
      worker.postMessage(sentQueue.buffer);
    }, 250);
    setTimeout(function () {
      const sentQueueReserveView = sentQueue.reserve({
        length: 0x10,
      });
      sentQueueReserveView[0x00] = 0x10;
      sentQueueReserveView[0x01] = 0x11;
      sentQueueReserveView[0x02] = 0x12;
      sentQueueReserveView[0x03] = 0x13;
      sentQueueReserveView[0x04] = 0x14;
      sentQueueReserveView[0x05] = 0x15;
      sentQueueReserveView[0x06] = 0x16;
      sentQueueReserveView[0x07] = 0x17;
      sentQueueReserveView[0x08] = 0x18;
      sentQueueReserveView[0x09] = 0x19;
      sentQueueReserveView[0x0A] = 0x1A;
      sentQueueReserveView[0x0B] = 0x1B;
      sentQueueReserveView[0x0C] = 0x1C;
      sentQueueReserveView[0x0D] = 0x1D;
      sentQueueReserveView[0x0E] = 0x1E;
      sentQueueReserveView[0x0F] = 0x1F;
      sentQueue.enqueue();
    }, 1000);
    setTimeout(function () {
      const receivedQueueDequeueView = new receivedQueue.viewCtor(0x10);
      receivedQueue.dequeue({
        view: receivedQueueDequeueView,
      });
      for (let i = 0; i < 0x10; ++i) {
        console.log(receivedQueueDequeueView + "[0x" + i.toString(16).padStart("0", 2) + "]: 0x" + receivedQueueDequeueView[i].toString(16).padStart("0", 2));
      }
    }, 2000);
  } catch (e) {
    console.error(e);
  }
}
