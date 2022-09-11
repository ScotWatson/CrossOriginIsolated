/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import("https://scotwatson.github.io/Queue/Queue.mjs").then(function (Queue) {
  let sentQueue = new Queue.DataQueue({
    viewCtor: Uint8Array,
    length: 20,
    shared: true,
  });
  let receivedQueue;

  self.addEventListener("message", function (evt) {
    console.log("worker.js message event triggered.");
    receivedQueue = new Queue.DataQueue({
      buffer: evt.data,
      shared: true,
    });
  });

  setTimeout(function () {
    self.postMessage(sentQueue.buffer);
  }, 250);
  
  setTimeout(function () {
    const sentQueueReserveView = sentQueue.reserve({
      length: 0x10,
    });
    sentQueueReserveView[0x00] = 0x30;
    sentQueueReserveView[0x01] = 0x31;
    sentQueueReserveView[0x02] = 0x32;
    sentQueueReserveView[0x03] = 0x33;
    sentQueueReserveView[0x04] = 0x34;
    sentQueueReserveView[0x05] = 0x35;
    sentQueueReserveView[0x06] = 0x36;
    sentQueueReserveView[0x07] = 0x37;
    sentQueueReserveView[0x08] = 0x38;
    sentQueueReserveView[0x09] = 0x39;
    sentQueueReserveView[0x0A] = 0x3A;
    sentQueueReserveView[0x0B] = 0x3B;
    sentQueueReserveView[0x0C] = 0x3C;
    sentQueueReserveView[0x0D] = 0x3D;
    sentQueueReserveView[0x0E] = 0x3E;
    sentQueueReserveView[0x0F] = 0x3F;
    sentQueue.enqueue();
  }, 500);
  setTimeout(function () {
    const receivedQueueDequeueView = new receivedQueue.viewCtor(0x10);
    receivedQueue.dequeue({
      view: receivedQueueDequeueView,
    });
    for (let i = 0; i < 0x10; ++i) {
      console.log(receivedQueueDequeueView + "[0x" + i.toString(16).padStart("0", 2) + "]: 0x" + receivedQueueDequeueView[i].toString(16).padStart("0", 2));
    }
  }, 1500);

});
