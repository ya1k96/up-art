new Vue({
    el: '#mainImages',
    data () {
        return {
            items: [],
            query: '',
            paginas: 0,
            actualPage: 1
        }
    },
    mounted () {
        axios
        .get('../images-list')
        .then(response => this.items = response.data.articulos)
    },
    watch: {
      query: function() {
        this.buscarArticulo()
      }
    },
    created: function() {
        this.buscarArticulo = _.debounce(this.search, 500)
    },
    methods: {
        search:  function () {
          var vm = this
          axios.get('../buscar-articulo/'+ this.query)
            .then(function (response) {
              vm.answer = _.capitalize(response.data.answer)
            })
            
        }
      }
})  