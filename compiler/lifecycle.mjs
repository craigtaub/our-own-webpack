/*
 * This module creates a lifecycle/events system which allows for plugins.
 * The listener can "plug in" to any lifecycle event.
 */
import events from "events";
import clc from "cli-color";

// Create an eventEmitter object
const eventEmitter = new events.EventEmitter();

/* Available events:
- start
- build_graph
- returned_graph
- transform_deps
- return_bundle_string
- end
*/

// Basic systen events
eventEmitter.on("start", () => {
  console.log(clc.green("start"));
});
eventEmitter.on("build_graph", () => {
  console.log(clc.green("building graph"));
});
eventEmitter.on("transform_deps", lengthArray => {
  console.log(clc.green("transforming deps length:", lengthArray));
});
eventEmitter.on("end", () => {
  console.log(clc.green("Finished"));
});

export { eventEmitter };
