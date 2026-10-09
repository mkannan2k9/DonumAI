var slider = document.getElementById("scale");
var out = document.getElementById("scale-value");
if (slider && out) {
  out.textContent = slider.value;
  slider.addEventListener("input", function () { out.textContent = slider.value; });
}

var loadBtn = document.getElementById("load-models");
var modelSelect = document.getElementById("teacher");
var modelStatus = document.getElementById("model-status");
var keyInput = document.getElementById("api_key");

function fillModels(list) {
  modelSelect.innerHTML = "";
  if (!list.length) {
    var d = document.createElement("option");
    d.value = "";
    d.textContent = "Default model";
    modelSelect.appendChild(d);
    return;
  }
  list.forEach(function (m, i) {
    var opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.name + " (" + m.id + ")";
    if (i === 0) { opt.selected = true; }
    modelSelect.appendChild(opt);
  });
}

if (loadBtn && modelSelect && keyInput) {
  loadBtn.addEventListener("click", function () {
    if (!keyInput.value.trim()) {
      modelStatus.textContent = "Enter your API key first.";
      keyInput.focus();
      return;
    }
    loadBtn.disabled = true;
    modelStatus.textContent = "Loading models...";
    var body = new FormData();
    body.append("api_key", keyInput.value.trim());
    fetch("/models", { method: "POST", body: body, cache: "no-store", credentials: "omit" })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) { modelStatus.textContent = res.data.error || "Could not load models."; return; }
        var list = res.data.models || [];
        fillModels(list);
        modelStatus.textContent = list.length + " text models available for your key.";
      })
      .catch(function () { modelStatus.textContent = "Network error. Please try again."; })
      .then(function () { loadBtn.disabled = false; });
  });
}
