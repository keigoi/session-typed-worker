import { send, recv } from "session-typed-worker";
import * as proto from "./protocols";
import Worker from "worker-loader!./worker";

const p: proto.CheckNumbersEquality["client"] = new Worker();

(async () => {
  const p1 = send(p, 42);
  const p2 = send(p1, 42);
  const [v, _] = await recv(p2);
  console.log(v); // true
})();
