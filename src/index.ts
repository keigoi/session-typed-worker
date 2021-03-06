interface Port {
  postMessage: MessagePort["postMessage"];
  onmessage: MessagePort["onmessage"] | Worker["onmessage"];
}
interface Send<V, S> extends Port {
  kind: "send";
  value: V;
  cont: S;
}
interface Recv<V, S> extends Port {
  kind: "recv";
  value: V;
  cont: S;
}
interface Close {
  kind: "close";
}

type C2W<V, Cont extends { client: any; worker: any }> = {
  client: Send<V, Cont["client"]>;
  worker: Recv<V, Cont["worker"]>;
};
type W2C<V, Cont extends { client: any; worker: any }> = {
  client: Recv<V, Cont["client"]>;
  worker: Send<V, Cont["worker"]>;
};
type Fin = { client: Close; worker: Close };

function send<V, S>(port: Send<V, S>, value: V): S {
  port.postMessage(value);
  return port as any;
}

function recv<V, S>(port: Recv<V, S>): Promise<[V, S]> {
  return new Promise(
    resolve => (port.onmessage = e => resolve([e.data, port as any]))
  );
}

export { C2W, W2C, Fin, send, recv };
