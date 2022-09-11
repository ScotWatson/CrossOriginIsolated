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
    receivedQueue = new Queue.DataQueue({
      buffer: evt.data,
      shared: true,
    });
  });

  self.postMessage(sentQueue.buffer);
});
