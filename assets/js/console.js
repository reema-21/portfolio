console.log("console.js loaded");
let timer;

let ConsoleWriter = {
  text: null,
  accessCountimer: null,
  index: 0,
  speed: 2,
  file: "",
  accessCount: 0,
  deniedCount: 0,
  init: function () {
    ConsoleWriter.accessCountimer = setInterval(function () {
      ConsoleWriter.updLstChr();
    }, 500);
    $.get(ConsoleWriter.file, function (data) {
      ConsoleWriter.text = data;
      ConsoleWriter.text = ConsoleWriter.text.slice(0, -1);
      timer = setInterval(t, 30);
    });
  },

  content: function () {
    return $("#console").html();
  },

  write: function (str) {
    $("#console").append(str);
    return false;
  },

  addText: function (key) {
    if (ConsoleWriter.handleSpecialKey(key)) {
      ConsoleWriter.preventKeyDefault(key);
      return;
    }

    if (ConsoleWriter.text) {
      ConsoleWriter.updateConsole(key);
    }

    ConsoleWriter.preventKeyDefault(key);
  },

  handleSpecialKey: function (key) {
    const actions = {
      18: () => ConsoleWriter.checkAccess(),
      20: () => ConsoleWriter.checkDenied(),
      27: () => ConsoleWriter.hidepop(),
    };

    const action = actions[key.keyCode];

    if (!action) {
      return false;
    }

    action();
    return true;
  },

  checkAccess: function () {
    ConsoleWriter.accessCount++;

    if (ConsoleWriter.accessCount >= 3) {
      ConsoleWriter.makeAccess();
    }
  },

  checkDenied: function () {
    ConsoleWriter.deniedCount++;

    if (ConsoleWriter.deniedCount >= 3) {
      ConsoleWriter.makeDenied();
    }
  },

  updateConsole: function (key) {
    const cont = ConsoleWriter.content();

    if (cont.endsWith("|")) {
      $("#console").html(cont.slice(0, -1));
    }

    ConsoleWriter.index +=
      key.keyCode == 8 ? -ConsoleWriter.speed : ConsoleWriter.speed;

    ConsoleWriter.index = Math.max(0, ConsoleWriter.index);

    const text = ConsoleWriter.text.substring(0, ConsoleWriter.index);
    $("#console").html(text.replaceAll("\n", "<br/>"));
    window.scrollBy(0, 50);
  },

  preventKeyDefault: function (key) {
    if (key.preventDefault && key.keyCode != 122) {
      key.preventDefault();
    }

    if (key.keyCode != 122) {
      key.returnValue = false;
    }
  },

  updLstChr: function () {
    let cont = this.content();

    if (cont.substring(cont.length - 1, cont.length) == "|")
      $("#console").html(
        $("#console")
          .html()
          .substring(0, cont.length - 1),
      );
    else this.write("|"); // else write it
  },
};

function replaceUrls(text) {
  let http = text.indexOf("http://");
  let space = text.indexOf(".me ", http);

  if (space != -1) {
    let url = text.slice(http, space - 1);
    return text.replace(url, `<a href="${url}">${url}</a>`);
  } else {
    return text;
  }
}

ConsoleWriter.speed = 3;
ConsoleWriter.file = "assets/static/hello.txt";

function t() {
  ConsoleWriter.addText({ keyCode: 123748 });

  if (ConsoleWriter.index > ConsoleWriter.text.length) {
    clearInterval(timer);
  }
}


$(function () {
  ConsoleWriter.init();
});