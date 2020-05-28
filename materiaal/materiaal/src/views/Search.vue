<template id="search">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h1>Materiaal Zoeken</h1>
      <form m v-on:submit.prevent="search">
        <div class="row">
          <div class="col-8 big-search">
            <div class="input-group mb-2 mr-sm-2">
              <div class="input-group-prepend">
                <div class="input-group-text">{{prefix}}</div>
              </div>
              <input type="text" class="form-control" v-model="doelgroepnummer" placeholder="" v-focus />
            </div>
          </div>
          <div class="co-4">
            <button
              type="button"
              class="btn btn-lg btn-success"
              v-on:click="search()"
              :disabled="searching"
            >
              <font-awesome-icon :icon="['fas', 'search']" /> Zoeken
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Type</label>
              </div>
              <select class="custom-select" v-model="prefix">
                <option value="MVM">Doelgroep</option>
                <option value="E">Eenmaligen</option>
                <option value>Op naam zoeken</option>
              </select>
            </div>
          </div>
        </div>
      </form>
      <div class="row" v-if="results.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Doelgroepnummer</th>
              <th scope="col">Voornaam</th>
              <th scope="col">Naam</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id">
              <td>
                <a :href="'#/details/'+result.id">{{result.doelgroepnummer}}</a>
              </td>
              <td>{{result.voornaam}}</td>
              <td>{{result.naam}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  template: "#search",
  components: {},
  data: function() {
    return {
      loading: true,
      doelgroepnummer: "",
      prefix: "MVM",
      searching: false,
      results: []
    };
  },

  methods: {
    search: function() {
      let vm = this;
      this.searching = true;
      window.ZOHO.CRM.API.searchRecord({
        Entity: "Materiaal",
        Type: "word",
        Query: `${this.prefix}${this.doelgroepnummer}`
      }).then(function(res) {
        vm.searching = false;

        vm.results = [];
        if (!res.data || res.data.length <= 0) {
          vm.$Simplert.open({
            title: "Geen Resultaten!",
            message: "Geen resultaten gevonden voor de zoekopdracht!",
            type: "error",
            customCloseBtnText: "Sluiten"
          });
          return;
        }

        if (res.data.length === 1) {
          vm.$router.push({ name: "details", params: { id: res.data[0].id } });
          return;
        }

        for (let result of res.data) {
          vm.results.push({
            id: result.id,
            naam: result.Naam,
            voornaam: result.Voornaam,
            doelgroepnummer: result.Doelgroep_Nummer
          });
        }
      });
    }
  },

  created: function() {
    let vm = this;
    window.ZOHO.embeddedApp.on("PageLoad", function() {
      vm.loading = false;
    });
    window.ZOHO.embeddedApp.init();
  }
};
</script>
