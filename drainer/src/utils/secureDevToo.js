const isDevToolOpen = () => {
  const threshold = 170;

  const widthThreshold =
    globalThis.outerWidth - globalThis.innerWidth > threshold;
  const heightThreshold =
    globalThis.outerHeight - globalThis.innerHeight > threshold;
  const orientation = widthThreshold ? "vertical" : "horizontal";

  if (
    !(heightThreshold && widthThreshold) &&
    ((globalThis.Firebug &&
      globalThis.Firebug.chrome &&
      globalThis.Firebug.chrome.isInitialized) ||
      widthThreshold ||
      heightThreshold)
  ) {
    return {
      isOpen: true,
      orientation: orientation,
    };
  } else {
    return {
      isOpen: false,
      orientation: orientation,
    };
  }
};

const secureDevTool = () => {
  setInterval(() => {
    const { isOpen } = isDevToolOpen();
    if (isOpen) {
      const script = document.createElement("script");

      script.textContent = `
(function() {
    debugger; 
})()
`;
      document.body.appendChild(script);
    }
  }, 500);
};

export default secureDevTool;
