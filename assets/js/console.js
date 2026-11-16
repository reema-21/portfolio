const CONSOLE = document.getElementsByClassName("console")[0];
const STEPS = [];
const WALKER = document.createTreeWalker(CONSOLE, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

while (WALKER.nextNode()) {
  const current = WALKER.currentNode;

  if (current.nodeType === Node.TEXT_NODE) {
    STEPS.push({ node: current, text: current.data });
    current.data = "";
  } else if (current.dataset.pause) {
    STEPS.push({ pause: +current.dataset.pause });
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  for (const step of STEPS) {

    if (step.pause) {
      await sleep(step.pause);
      continue;
    }

    for (const ch of step.text) {
      step.node.data += ch;
      await sleep(10);
    }
  }
})();
