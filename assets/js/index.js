const $ = document.querySelector.bind(document);
const url = new URL(window.location);

const masterPicture = $("#master-picture");
const masterSpan = $("#master-info");

const containerControl = {
  hide: function () {
    this.style.display = "none";
  },
  show: function () {
    this.style.display = "inline-block";
  },
};

const welcomeContainer = Object.assign($("#welcome-container"), containerControl);

const resultContainer = Object.assign($("#result-container"), containerControl);

const RESOURCES = {
  LABELS: {
    MASTER_LABEL: "Your master is",
  },
  URLS: {
    JEDI: `https://swapi.dev/api/people/1`,
    SITH: `https://swapi.dev/api/people/4`,
  },
  PICTURES: {
    JEDI: `https://especiais.ne10.uol.com.br/starwars/wp-content/uploads/2015/12/luke-300x300.png`,
    SITH: `https://especiais.ne10.uol.com.br/starwars/wp-content/uploads/2015/12/darth_vader-300x300.png`,
  },
  COLORS: {
    JEDI: {
      PRIMARY: "#FBFE63",
      SECONDARY: "#2A2A2A",
    },
    SITH: {
      PRIMARY: "#2B2B2B",
      SECONDARY: "#FFF",
    },
  },
};

const openWelcome = () => {
  welcomeContainer.show();
  resultContainer.hide();
  $("body").style.color = "#2C97D1";
};

const chooseDestiny = async () => {
  const getJedi = fetch(RESOURCES.URLS.JEDI).then((resp) => resp.json());
  const getSith = fetch(RESOURCES.URLS.SITH).then((resp) => resp.json());

  const result = await Promise.race([getJedi, getSith]);

  const forceSide = isJedi(result) ? "JEDI" : "SITH";
  setContent(result, forceSide);
  welcomeContainer.hide();
  resultContainer.show();
};

const isJedi = (result) => result.name === "Luke Skywalker";

const setContent = (result, side) => {
  setContentColors(side);
  setPicture(RESOURCES.PICTURES[side], result.name, masterPicture);
  setMasterLabel(RESOURCES.LABELS.MASTER_LABEL, result.name, masterSpan);
};

const setContentColors = (side) => {
  $("body").style.backgroundColor = RESOURCES.COLORS[side].PRIMARY;
  $("body").style.color = RESOURCES.COLORS[side].SECONDARY;
  $("#destiny-button").style.backgroundColor = RESOURCES.COLORS[side].SECONDARY;
  $("#destiny-button").style.color = RESOURCES.COLORS[side].PRIMARY;
};

const setPicture = (src, alt, elementToApply) =>
  Object.assign(elementToApply, { src, alt });

const setMasterLabel = (baseLabel, masterName, elementToApply) =>
  Object.assign(elementToApply, {
    innerHTML: `${baseLabel} <strong>${masterName}</strong>`,
  });

// My Ultra Simple Router =)
class GambiarRouter {
  DEFAULT_ROUTE = "#welcome";

  ROUTES = {
    "#welcome": openWelcome,
    "#destiny": chooseDestiny,
  };

  go = (hash) => location.hash = hash;

  goHome = () => this.go(this.DEFAULT_ROUTE);

  openContent = () => {
    const defaultRoute = this.ROUTES["#welcome"];
    const load = (this.ROUTES[url.hash] || defaultRoute);
    load();
  };

  processUrl = () => {
    const navigate = this.ROUTES[url.hash];
    const isValidRoute = !!navigate;
    console.log(isValidRoute, url.hash, window.location.hash);
    isValidRoute ? this.openContent() : this.goHome();
  };
};

const router = new GambiarRouter();
const goBack = () => router.goHome();
const goDestiny = () => router.go("#destiny");

window.onload = router.processUrl;
window.onhashchange = () => location.reload();

(()=> {
  welcomeContainer.hide();
  resultContainer.hide();
})();